'use client'

import { Event } from '@/types'

export interface NotificationChannel {
  type: 'browser' | 'email' | 'sms' | 'push'
  enabled: boolean
  priority: number
  reliability: number
}

export interface NotificationConfig {
  channels: NotificationChannel[]
  escalationRules: {
    immediate: string[]
    urgent: string[]
    high: string[]
    medium: string[]
    low: string[]
  }
  retryAttempts: number
  fallbackChain: string[]
}

export class BulletproofNotificationSystem {
  private config: NotificationConfig = {
    channels: [
      { type: 'browser', enabled: true, priority: 1, reliability: 0.95 },
      { type: 'push', enabled: true, priority: 2, reliability: 0.90 },
      { type: 'email', enabled: true, priority: 3, reliability: 0.85 },
      { type: 'sms', enabled: true, priority: 4, reliability: 0.99 }
    ],
    escalationRules: {
      immediate: ['browser', 'push', 'sms'],
      urgent: ['browser', 'push', 'email'],
      high: ['browser', 'push'],
      medium: ['browser', 'push'],
      low: ['browser']
    },
    retryAttempts: 3,
    fallbackChain: ['browser', 'push', 'email', 'sms']
  }

  private notificationQueue: Array<{
    id: string
    event: Event
    channels: string[]
    attempts: number
    maxAttempts: number
    scheduledTime: Date
    priority: number
  }> = []

  private isProcessing = false

  constructor() {
    this.startNotificationProcessor()
    this.setupServiceWorker()
  }

  // Schedule a notification with bulletproof delivery
  public async scheduleNotification(
    event: Event, 
    reminderTime: Date,
    options: {
      channels?: string[]
      priority?: number
      escalation?: boolean
    } = {}
  ): Promise<string> {
    const notificationId = `reminder-${event.id}-${Date.now()}`
    
    // Determine channels based on priority and options
    const channels = this.determineChannels(event.priority, options.channels)
    
    // Calculate notification priority
    const priority = this.calculatePriority(event.priority, reminderTime)
    
    // Add to queue with multiple delivery attempts
    const notification = {
      id: notificationId,
      event,
      channels,
      attempts: 0,
      maxAttempts: options.escalation ? this.config.retryAttempts : 1,
      scheduledTime: reminderTime,
      priority
    }

    this.notificationQueue.push(notification)
    
    // If notification is immediate or very soon, process immediately
    const timeUntilNotification = reminderTime.getTime() - Date.now()
    if (timeUntilNotification <= 60000) { // Within 1 minute
      await this.processNotification(notification)
    } else {
      // Schedule for later processing
      setTimeout(() => {
        this.processNotification(notification)
      }, timeUntilNotification)
    }

    return notificationId
  }

  // Process notification through multiple channels with fallback
  private async processNotification(notification: any): Promise<boolean> {
    const { id, event, channels, attempts, maxAttempts } = notification
    
    console.log(`Processing notification ${id}, attempt ${attempts + 1}/${maxAttempts}`)
    
    let successCount = 0
    const results: { [channel: string]: boolean } = {}

    // Try each channel in priority order
    for (const channel of channels) {
      try {
        const success = await this.sendToChannel(event, channel)
        results[channel] = success
        if (success) {
          successCount++
          console.log(`✅ Notification sent via ${channel}`)
        } else {
          console.log(`❌ Failed to send via ${channel}`)
        }
      } catch (error) {
        console.error(`Error sending notification via ${channel}:`, error)
        results[channel] = false
      }
    }

    // If no channels succeeded and we have retry attempts left
    if (successCount === 0 && attempts < maxAttempts - 1) {
      console.log(`Retrying notification ${id} in 30 seconds...`)
      
      // Retry with exponential backoff
      setTimeout(() => {
        notification.attempts++
        this.processNotification(notification)
      }, 30000 * (attempts + 1))
      
      return false
    }

    // If still no success and this is urgent, escalate
    if (successCount === 0 && event.priority === 'Urgent') {
      await this.escalateNotification(event, results)
    }

    // Log final results
    console.log(`Notification ${id} completed:`, {
      successful: successCount > 0,
      channels: results,
      attempts: attempts + 1
    })

    return successCount > 0
  }

  // Send notification to specific channel
  private async sendToChannel(event: Event, channel: string): Promise<boolean> {
    switch (channel) {
      case 'browser':
        return await this.sendBrowserNotification(event)
      
      case 'push':
        return await this.sendPushNotification(event)
      
      case 'email':
        return await this.sendEmailNotification(event)
      
      case 'sms':
        return await this.sendSMSNotification(event)
      
      default:
        console.warn(`Unknown notification channel: ${channel}`)
        return false
    }
  }

  // Browser notification with enhanced features
  private async sendBrowserNotification(event: Event): Promise<boolean> {
    try {
      // Request permission if not granted
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }

      if (Notification.permission !== 'granted') {
        console.warn('Browser notifications not permitted')
        return false
      }

      // Create rich notification
      const notification = new Notification(event.title, {
        body: this.formatNotificationBody(event),
        icon: '/icons/remind-icon-192.png',
        badge: '/icons/remind-badge-72.png',
        tag: `reminder-${event.id}`,
        requireInteraction: event.priority === 'Urgent',
        silent: false,
        vibrate: event.priority === 'Urgent' ? [200, 100, 200] : [100],
        actions: [
          {
            action: 'snooze',
            title: 'Snooze 15min',
            icon: '/icons/snooze.png'
          },
          {
            action: 'complete',
            title: 'Mark Done',
            icon: '/icons/check.png'
          }
        ],
        data: {
          eventId: event.id,
          priority: event.priority,
          category: event.category
        }
      })

      // Handle notification clicks
      notification.onclick = () => {
        window.focus()
        notification.close()
        // Navigate to event in app
        window.location.href = `/dashboard?event=${event.id}`
      }

      // Auto-close after 10 seconds for non-urgent notifications
      if (event.priority !== 'Urgent') {
        setTimeout(() => notification.close(), 10000)
      }

      return true
    } catch (error) {
      console.error('Browser notification failed:', error)
      return false
    }
  }

  // Push notification via service worker
  private async sendPushNotification(event: Event): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported')
        return false
      }

      const registration = await navigator.serviceWorker.ready
      
      if (!registration.pushManager) {
        console.warn('Push manager not available')
        return false
      }

      // Check subscription
      const subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        console.warn('No push subscription found')
        return false
      }

      // Send push notification via API
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          subscription,
          payload: {
            title: event.title,
            body: this.formatNotificationBody(event),
            icon: '/icons/remind-icon-192.png',
            badge: '/icons/remind-badge-72.png',
            tag: `reminder-${event.id}`,
            requireInteraction: event.priority === 'Urgent',
            data: {
              eventId: event.id,
              priority: event.priority,
              category: event.category
            }
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Push notification failed:', error)
      return false
    }
  }

  // Email notification
  private async sendEmailNotification(event: Event): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          to: this.getUserEmail(),
          subject: `RE:MIND: ${event.title}`,
          template: 'reminder',
          data: {
            event,
            reminderTime: new Date().toLocaleString(),
            priority: event.priority
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Email notification failed:', error)
      return false
    }
  }

  // SMS notification (for urgent reminders)
  private async sendSMSNotification(event: Event): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          to: this.getUserPhone(),
          message: `RE:MIND: ${event.title} - ${new Date(event.start_date).toLocaleString()}`
        })
      })

      return response.ok
    } catch (error) {
      console.error('SMS notification failed:', error)
      return false
    }
  }

  // Escalate notification when primary channels fail
  private async escalateNotification(event: Event, failedResults: { [channel: string]: boolean }): Promise<void> {
    console.log(`🚨 ESCALATING notification for urgent event: ${event.title}`)
    
    // Try fallback channels
    for (const fallbackChannel of this.config.fallbackChain) {
      if (!failedResults[fallbackChannel]) {
        try {
          const success = await this.sendToChannel(event, fallbackChannel)
          if (success) {
            console.log(`✅ Escalation successful via ${fallbackChannel}`)
            return
          }
        } catch (error) {
          console.error(`Escalation failed via ${fallbackChannel}:`, error)
        }
      }
    }

    // If all channels fail, log critical failure
    console.error(`🚨 CRITICAL: All notification channels failed for urgent event: ${event.title}`)
    
    // Could implement additional escalation here:
    // - Call external notification service
    // - Send to admin/emergency contacts
    // - Log to monitoring system
  }

  // Determine which channels to use based on priority
  private determineChannels(priority: string, customChannels?: string[]): string[] {
    if (customChannels) {
      return customChannels
    }

    switch (priority) {
      case 'Urgent':
        return this.config.escalationRules.urgent
      case 'High':
        return this.config.escalationRules.high
      case 'Medium':
        return this.config.escalationRules.medium
      case 'Low':
        return this.config.escalationRules.low
      default:
        return this.config.escalationRules.medium
    }
  }

  // Calculate notification priority score
  private calculatePriority(eventPriority: string, reminderTime: Date): number {
    const timeUntilEvent = reminderTime.getTime() - Date.now()
    const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60)
    
    let priorityScore = 0
    
    // Priority based on event priority
    switch (eventPriority) {
      case 'Urgent':
        priorityScore += 100
        break
      case 'High':
        priorityScore += 75
        break
      case 'Medium':
        priorityScore += 50
        break
      case 'Low':
        priorityScore += 25
        break
    }
    
    // Boost priority if very soon
    if (hoursUntilEvent < 1) {
      priorityScore += 50
    } else if (hoursUntilEvent < 24) {
      priorityScore += 25
    }
    
    return priorityScore
  }

  // Format notification body text
  private formatNotificationBody(event: Event): string {
    const eventTime = new Date(event.start_date).toLocaleString()
    const location = event.location ? ` at ${event.location}` : ''
    
    return `${eventTime}${location}\n${event.category} • ${event.priority} Priority`
  }

  // Setup service worker for push notifications
  private setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
          
          // Handle push events
          registration.addEventListener('push', (event) => {
            if (event.data) {
              const data = event.data.json()
              this.handlePushEvent(data)
            }
          })
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }

  // Handle incoming push events
  private handlePushEvent(data: any): void {
    const options = {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      actions: data.actions,
      data: data.data
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(data.title, options)
      })
    }
  }

  // Start background notification processor
  private startNotificationProcessor(): void {
    // Process queue every 30 seconds
    setInterval(() => {
      if (!this.isProcessing && this.notificationQueue.length > 0) {
        this.processQueue()
      }
    }, 30000)
  }

  // Process notification queue
  private async processQueue(): Promise<void> {
    this.isProcessing = true
    
    const now = Date.now()
    const readyNotifications = this.notificationQueue.filter(
      notification => notification.scheduledTime.getTime() <= now
    )

    for (const notification of readyNotifications) {
      await this.processNotification(notification)
    }

    // Remove processed notifications
    this.notificationQueue = this.notificationQueue.filter(
      notification => notification.scheduledTime.getTime() > now
    )

    this.isProcessing = false
  }

  // Helper methods
  private getAuthToken(): string {
    // Get JWT token from localStorage or cookies
    return localStorage.getItem('auth_token') || ''
  }

  private getUserEmail(): string {
    // Get user email from user context or localStorage
    return localStorage.getItem('user_email') || ''
  }

  private getUserPhone(): string {
    // Get user phone from user context or localStorage
    return localStorage.getItem('user_phone') || ''
  }

  // Public methods for configuration
  public updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  public getConfig(): NotificationConfig {
    return this.config
  }

  public getQueueStatus(): { pending: number; processing: boolean } {
    return {
      pending: this.notificationQueue.length,
      processing: this.isProcessing
    }
  }
}

// Global instance
let notificationSystem: BulletproofNotificationSystem | null = null

export function getNotificationSystem(): BulletproofNotificationSystem {
  if (!notificationSystem) {
    notificationSystem = new BulletproofNotificationSystem()
  }
  return notificationSystem
}
