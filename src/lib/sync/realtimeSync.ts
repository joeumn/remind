'use client'

import { Event } from '@/types'
import { createClient } from '@supabase/supabase-js'

interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  lastSync: Date | null
  pendingChanges: number
  conflicts: Array<{
    id: string
    localVersion: Event
    serverVersion: Event
    timestamp: Date
  }>
}

interface SyncOptions {
  autoSync: boolean
  conflictResolution: 'server-wins' | 'client-wins' | 'manual'
  syncInterval: number // in milliseconds
  batchSize: number
}

export class RealtimeSyncSystem {
  private supabase: any
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    conflicts: []
  }
  
  private options: SyncOptions = {
    autoSync: true,
    conflictResolution: 'server-wins',
    syncInterval: 30000, // 30 seconds
    batchSize: 50
  }
  
  private syncQueue: Array<{
    type: 'create' | 'update' | 'delete'
    data: Event
    timestamp: Date
  }> = []
  
  private listeners: Array<(status: SyncStatus) => void> = []
  private syncIntervalId: number | null = null

  constructor() {
    this.initializeSupabase()
    this.setupEventListeners()
    this.startAutoSync()
  }

  private initializeSupabase(): void {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found. Real-time sync disabled.')
      return
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.setupRealtimeSubscription()
  }

  private setupRealtimeSubscription(): void {
    if (!this.supabase) return

    // Subscribe to events table changes
    this.supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload: any) => {
          console.log('Real-time event received:', payload)
          this.handleRemoteChange(payload)
        }
      )
      .subscribe()
  }

  private setupEventListeners(): void {
    // Online/offline status
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true
      this.notifyListeners()
      this.performSync()
    })

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false
      this.notifyListeners()
    })

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.syncStatus.isOnline) {
        this.performSync()
      }
    })

    // Before page unload - save pending changes
    window.addEventListener('beforeunload', () => {
      this.savePendingChangesToStorage()
    })

    // Load pending changes from storage on page load
    this.loadPendingChangesFromStorage()
  }

  private startAutoSync(): void {
    if (this.options.autoSync) {
      this.syncIntervalId = window.setInterval(() => {
        if (this.syncStatus.isOnline && !this.syncStatus.isSyncing) {
          this.performSync()
        }
      }, this.options.syncInterval)
    }
  }

  // Add event to sync queue
  public queueEventChange(type: 'create' | 'update' | 'delete', event: Event): void {
    const change = {
      type,
      data: event,
      timestamp: new Date()
    }

    this.syncQueue.push(change)
    this.syncStatus.pendingChanges = this.syncQueue.length
    this.notifyListeners()

    // If online, try to sync immediately
    if (this.syncStatus.isOnline) {
      this.performSync()
    }
  }

  // Perform sync operation
  public async performSync(): Promise<void> {
    if (this.syncStatus.isSyncing || !this.syncStatus.isOnline) {
      return
    }

    this.syncStatus.isSyncing = true
    this.notifyListeners()

    try {
      // Process sync queue
      await this.processSyncQueue()
      
      // Fetch latest changes from server
      await this.fetchLatestChanges()
      
      // Resolve any conflicts
      await this.resolveConflicts()
      
      this.syncStatus.lastSync = new Date()
      this.syncStatus.pendingChanges = this.syncQueue.length
      
      console.log('✅ Sync completed successfully')
    } catch (error) {
      console.error('❌ Sync failed:', error)
    } finally {
      this.syncStatus.isSyncing = false
      this.notifyListeners()
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return

    const batch = this.syncQueue.splice(0, this.options.batchSize)
    
    for (const change of batch) {
      try {
        await this.syncChangeToServer(change)
      } catch (error) {
        console.error('Failed to sync change:', error)
        // Re-queue failed changes
        this.syncQueue.unshift(change)
      }
    }
  }

  private async syncChangeToServer(change: { type: string; data: Event; timestamp: Date }): Promise<void> {
    if (!this.supabase) return

    switch (change.type) {
      case 'create':
        await this.supabase
          .from('events')
          .insert([this.eventToDbFormat(change.data)])
        break
        
      case 'update':
        await this.supabase
          .from('events')
          .update(this.eventToDbFormat(change.data))
          .eq('id', change.data.id)
        break
        
      case 'delete':
        await this.supabase
          .from('events')
          .update({ status: 'deleted' })
          .eq('id', change.data.id)
        break
    }
  }

  private async fetchLatestChanges(): Promise<void> {
    if (!this.supabase) return

    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .gte('updated_at', this.syncStatus.lastSync?.toISOString() || '1970-01-01T00:00:00Z')
      .neq('status', 'deleted')

    if (error) {
      console.error('Failed to fetch latest changes:', error)
      return
    }

    // Process server changes
    for (const serverEvent of data || []) {
      this.handleServerEvent(serverEvent)
    }
  }

  private handleServerEvent(serverEvent: any): void {
    const localEvent = this.getLocalEvent(serverEvent.id)
    
    if (!localEvent) {
      // New event from server
      this.addLocalEvent(this.dbToEventFormat(serverEvent))
    } else {
      // Check for conflicts
      const localUpdated = new Date(localEvent.updated_at)
      const serverUpdated = new Date(serverEvent.updated_at)
      
      if (localUpdated > serverUpdated) {
        // Local version is newer - conflict
        this.addConflict(localEvent, this.dbToEventFormat(serverEvent))
      } else if (serverUpdated > localUpdated) {
        // Server version is newer - update local
        this.updateLocalEvent(this.dbToEventFormat(serverEvent))
      }
    }
  }

  private handleRemoteChange(payload: any): void {
    console.log('Handling remote change:', payload)
    
    const event = this.dbToEventFormat(payload.new || payload.old)
    
    switch (payload.eventType) {
      case 'INSERT':
        this.addLocalEvent(event)
        break
        
      case 'UPDATE':
        this.updateLocalEvent(event)
        break
        
      case 'DELETE':
        this.removeLocalEvent(event.id)
        break
    }
  }

  private addConflict(localEvent: Event, serverEvent: Event): void {
    const conflict = {
      id: localEvent.id,
      localVersion: localEvent,
      serverVersion: serverEvent,
      timestamp: new Date()
    }

    this.syncStatus.conflicts.push(conflict)
    this.notifyListeners()
  }

  private async resolveConflicts(): Promise<void> {
    if (this.syncStatus.conflicts.length === 0) return

    for (const conflict of this.syncStatus.conflicts) {
      let resolvedEvent: Event

      switch (this.options.conflictResolution) {
        case 'server-wins':
          resolvedEvent = conflict.serverVersion
          break
          
        case 'client-wins':
          resolvedEvent = conflict.localVersion
          break
          
        case 'manual':
          // In a real app, show UI for user to choose
          resolvedEvent = conflict.serverVersion
          break
          
        default:
          resolvedEvent = conflict.serverVersion
      }

      this.updateLocalEvent(resolvedEvent)
    }

    this.syncStatus.conflicts = []
    this.notifyListeners()
  }

  // Storage helpers
  private savePendingChangesToStorage(): void {
    localStorage.setItem('remind_pending_sync', JSON.stringify(this.syncQueue))
  }

  private loadPendingChangesFromStorage(): void {
    try {
      const stored = localStorage.getItem('remind_pending_sync')
      if (stored) {
        this.syncQueue = JSON.parse(stored)
        this.syncStatus.pendingChanges = this.syncQueue.length
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to load pending changes:', error)
    }
  }

  // Event format conversion
  private eventToDbFormat(event: Event): any {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      is_all_day: event.is_all_day,
      location: event.location,
      category: event.category,
      priority: event.priority,
      status: event.status,
      reminder_settings: JSON.stringify(event.reminder_settings),
      user_id: event.user_id,
      created_at: event.created_at,
      updated_at: event.updated_at
    }
  }

  private dbToEventFormat(dbEvent: any): Event {
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      description: dbEvent.description,
      start_date: dbEvent.start_date,
      end_date: dbEvent.end_date,
      is_all_day: dbEvent.is_all_day,
      location: dbEvent.location,
      category: dbEvent.category,
      priority: dbEvent.priority,
      status: dbEvent.status,
      reminder_settings: dbEvent.reminder_settings ? JSON.parse(dbEvent.reminder_settings) : undefined,
      user_id: dbEvent.user_id,
      created_at: dbEvent.created_at,
      updated_at: dbEvent.updated_at
    }
  }

  // Local storage helpers (in a real app, these would interact with your state management)
  private getLocalEvent(id: string): Event | null {
    // This would get from your Zustand store or local storage
    const events = JSON.parse(localStorage.getItem('remind_events') || '[]')
    return events.find((e: Event) => e.id === id) || null
  }

  private addLocalEvent(event: Event): void {
    // This would add to your Zustand store
    const events = JSON.parse(localStorage.getItem('remind_events') || '[]')
    events.push(event)
    localStorage.setItem('remind_events', JSON.stringify(events))
  }

  private updateLocalEvent(event: Event): void {
    // This would update your Zustand store
    const events = JSON.parse(localStorage.getItem('remind_events') || '[]')
    const index = events.findIndex((e: Event) => e.id === event.id)
    if (index !== -1) {
      events[index] = event
      localStorage.setItem('remind_events', JSON.stringify(events))
    }
  }

  private removeLocalEvent(id: string): void {
    // This would remove from your Zustand store
    const events = JSON.parse(localStorage.getItem('remind_events') || '[]')
    const filtered = events.filter((e: Event) => e.id !== id)
    localStorage.setItem('remind_events', JSON.stringify(filtered))
  }

  // Public API
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus }
  }

  public addSyncListener(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getSyncStatus()))
  }

  public updateOptions(newOptions: Partial<SyncOptions>): void {
    this.options = { ...this.options, ...newOptions }
    
    // Restart auto-sync if interval changed
    if (newOptions.syncInterval && this.syncIntervalId) {
      clearInterval(this.syncIntervalId)
      this.startAutoSync()
    }
  }

  public forceSync(): Promise<void> {
    return this.performSync()
  }

  public resolveConflict(conflictId: string, useLocalVersion: boolean): void {
    const conflictIndex = this.syncStatus.conflicts.findIndex(c => c.id === conflictId)
    if (conflictIndex === -1) return

    const conflict = this.syncStatus.conflicts[conflictIndex]
    const resolvedEvent = useLocalVersion ? conflict.localVersion : conflict.serverVersion

    this.updateLocalEvent(resolvedEvent)
    this.syncStatus.conflicts.splice(conflictIndex, 1)
    this.notifyListeners()
  }

  public destroy(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId)
    }
    
    if (this.supabase) {
      this.supabase.removeAllChannels()
    }
    
    this.savePendingChangesToStorage()
  }
}

// Global instance
let syncSystem: RealtimeSyncSystem | null = null

export function getSyncSystem(): RealtimeSyncSystem {
  if (!syncSystem) {
    syncSystem = new RealtimeSyncSystem()
  }
  return syncSystem
}

// Hook for React components
export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    conflicts: []
  })

  useEffect(() => {
    const sync = getSyncSystem()
    
    // Get initial status
    setSyncStatus(sync.getSyncStatus())
    
    // Subscribe to updates
    const unsubscribe = sync.addSyncListener(setSyncStatus)
    
    return unsubscribe
  }, [])

  return {
    ...syncStatus,
    forceSync: () => getSyncSystem().forceSync(),
    resolveConflict: (id: string, useLocal: boolean) => getSyncSystem().resolveConflict(id, useLocal)
  }
}
