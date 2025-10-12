'use client'

import { useEffect, useState, useCallback } from 'react'
import { useStore } from '@/store'

interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  lastSync: Date | null
  pendingChanges: number
  error: string | null
}

export function useSync() {
  const { events, addEvent, updateEvent, deleteEvent } = useStore()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    error: null
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true, error: null }))
      syncToServer()
    }

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-sync when events change
  useEffect(() => {
    if (syncStatus.isOnline) {
      syncToServer()
    }
  }, [events])

  // Sync to server
  const syncToServer = useCallback(async () => {
    if (!syncStatus.isOnline || syncStatus.isSyncing) return

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }))

    try {
      // Get pending changes from local storage
      const pendingChanges = getPendingChanges()
      
      if (pendingChanges.length === 0) {
        // Just fetch latest data
        await fetchLatestData()
      } else {
        // Sync pending changes
        await syncPendingChanges(pendingChanges)
      }

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date(),
        pendingChanges: 0
      }))

      // Clear pending changes after successful sync
      clearPendingChanges()
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }))
    }
  }, [syncStatus.isOnline, syncStatus.isSyncing])

  // Fetch latest data from server
  const fetchLatestData = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }

      const serverEvents = await response.json()
      
      // Merge with local data (server wins conflicts)
      serverEvents.forEach((serverEvent: any) => {
        const localEvent = events.find(e => e.id === serverEvent.id)
        if (!localEvent || new Date(serverEvent.updated_at) > new Date(localEvent.updated_at)) {
          updateEvent(serverEvent.id, serverEvent)
        }
      })
      
      console.log(`✅ Synced ${serverEvents.length} events from server`)
    } catch (error) {
      console.error('Failed to fetch latest data:', error)
      throw error
    }
  }

  // Sync pending changes to server
  const syncPendingChanges = async (pendingChanges: any[]) => {
    const batchSize = 10
    const batches = []
    
    for (let i = 0; i < pendingChanges.length; i += batchSize) {
      batches.push(pendingChanges.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (change) => {
          try {
            await syncChange(change)
          } catch (error) {
            console.error('Failed to sync change:', change, error)
            // Keep change in pending for retry
          }
        })
      )
    }
  }

  // Sync individual change
  const syncChange = async (change: any) => {
    const { type, data, timestamp } = change

    try {
      console.log(`🔄 Syncing ${type} operation for event: ${data.id || 'new'}`)
      
      switch (type) {
        case 'create':
          const createResponse = await fetch('/api/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          
          if (!createResponse.ok) {
            throw new Error(`Create failed: ${createResponse.status} ${createResponse.statusText}`)
          }
          break

        case 'update':
          const updateResponse = await fetch(`/api/events/${data.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          
          if (!updateResponse.ok) {
            throw new Error(`Update failed: ${updateResponse.status} ${updateResponse.statusText}`)
          }
          break

        case 'delete':
          const deleteResponse = await fetch(`/api/events/${data.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`
            }
          })
          
          if (!deleteResponse.ok) {
            throw new Error(`Delete failed: ${deleteResponse.status} ${deleteResponse.statusText}`)
          }
          break
      }
      
      console.log(`✅ ${type} operation synced successfully`)
    } catch (error) {
      console.error(`Failed to sync ${type} operation:`, error)
      throw error
    }
  }

  // Get pending changes from local storage
  const getPendingChanges = () => {
    try {
      const stored = localStorage.getItem('remind-pending-changes')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Add pending change
  const addPendingChange = (type: string, data: any) => {
    try {
      const pendingChanges = getPendingChanges()
      const change = {
        type,
        data,
        timestamp: new Date().toISOString(),
        id: `${type}-${Date.now()}-${Math.random()}`
      }
      
      pendingChanges.push(change)
      localStorage.setItem('remind-pending-changes', JSON.stringify(pendingChanges))
      
      setSyncStatus(prev => ({
        ...prev,
        pendingChanges: pendingChanges.length
      }))
    } catch (error) {
      console.error('Failed to add pending change:', error)
    }
  }

  // Clear pending changes
  const clearPendingChanges = () => {
    localStorage.removeItem('remind-pending-changes')
    setSyncStatus(prev => ({ ...prev, pendingChanges: 0 }))
  }

  // Get auth token (mock implementation)
  const getAuthToken = () => {
    return localStorage.getItem('remind-auth-token') || 'demo-token'
  }

  // Manual sync trigger
  const triggerSync = useCallback(() => {
    if (syncStatus.isOnline && !syncStatus.isSyncing) {
      syncToServer()
    }
  }, [syncStatus.isOnline, syncStatus.isSyncing, syncToServer])

  // Force sync (ignore conflicts)
  const forceSync = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }))
    
    try {
      await fetchLatestData()
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date(),
        pendingChanges: 0
      }))
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Force sync failed'
      }))
    }
  }, [])

  return {
    ...syncStatus,
    triggerSync,
    forceSync,
    addPendingChange
  }
}
