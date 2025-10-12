'use client'

import { createClient } from '@/lib/supabase/client'

interface NotificationData {
  id: string
  title: string
  message: string
  type: 'reminder' | 'event' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  action_url?: string
  created_at: string
}

export class RealtimeNotifications {
  private static instance: RealtimeNotifications
  private supabase = createClient()
  private channel: any = null
  private onNotification?: (notification: NotificationData) => void
  private isConnected = false

  private constructor() {}

  static getInstance(): RealtimeNotifications {
    if (!RealtimeNotifications.instance) {
      RealtimeNotifications.instance = new RealtimeNotifications()
    }
    return RealtimeNotifications.instance
  }

  async connect(userId: string, onNotification: (notification: NotificationData) => void) {
    if (this.isConnected) return

    this.onNotification = onNotification
    
    try {
      // Subscribe to notifications channel
      this.channel = this.supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            this.handleNotification(payload.new as NotificationData)
          }
        )
        .subscribe()

      this.isConnected = true
      console.log('Connected to realtime notifications')
    } catch (error) {
      console.error('Failed to connect to notifications:', error)
    }
  }

  disconnect() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
      this.isConnected = false
      console.log('Disconnected from realtime notifications')
    }
  }

  private handleNotification(notification: NotificationData) {
    // Show browser notification if permission granted
    this.showBrowserNotification(notification)
    
    // Call callback
    this.onNotification?.(notification)
  }

  private async showBrowserNotification(notification: NotificationData) {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications')
      return
    }

    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/icon-192x192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: notification.priority === 'low'
      })

      browserNotification.onclick = () => {
        window.focus()
        if (notification.action_url) {
          window.location.href = notification.action_url
        }
        browserNotification.close()
      }

      // Auto-close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close()
        }, 5000)
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        this.showBrowserNotification(notification)
      }
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  async sendNotification(data: Omit<NotificationData, 'id' | 'created_at'>) {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to send notification')
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  async markAsRead(notificationId: string) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      return await response.json()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  async getNotifications(limit = 50, offset = 0) {
    try {
      const response = await fetch(`/api/notifications?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  isNotificationSupported(): boolean {
    return 'Notification' in window
  }

  getNotificationPermission(): NotificationPermission | null {
    if (!('Notification' in window)) {
      return null
    }
    return Notification.permission
  }
}
