'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Bell, 
  BellOff, 
  Search, 
  Filter, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import { RealtimeNotifications } from '@/lib/notifications/realtimeNotifications'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface Notification {
  id: string
  title: string
  message: string
  type: 'reminder' | 'event' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'pending' | 'sent' | 'failed' | 'cancelled' | 'read'
  action_url?: string
  scheduled_for?: string
  sent_at?: string
  created_at: string
}

export default function AlertsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [realtimeNotifications] = useState(() => RealtimeNotifications.getInstance())
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    initializeNotifications()
  }, [])

  const initializeNotifications = async () => {
    try {
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Request notification permission
        const permission = await realtimeNotifications.requestNotificationPermission()
        setNotificationPermission(permission ? 'granted' : 'denied')
        
        // Connect to realtime notifications
        await realtimeNotifications.connect(user.id, handleRealtimeNotification)
      }
      
      await fetchNotifications()
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRealtimeNotification = (notification: any) => {
    // Convert NotificationData to Notification by adding missing fields
    const fullNotification: Notification = {
      ...notification,
      status: notification.status || 'pending',
      scheduled_for: notification.scheduled_for || new Date().toISOString()
    }
    setNotifications(prev => [fullNotification, ...prev])
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await realtimeNotifications.markAsRead(notificationId)
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, status: 'read' as const } : n
      ))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const requestNotificationPermission = async () => {
    const permission = await realtimeNotifications.requestNotificationPermission()
    setNotificationPermission(permission ? 'granted' : 'denied')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status || 'pending') {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || (notification.status || 'pending') === filterStatus
    const matchesType = filterType === 'all' || notification.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
            <p className="text-muted-foreground">
              Manage your notifications and alerts
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {notificationPermission !== 'granted' && (
              <Button variant="outline" onClick={requestNotificationPermission}>
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            )}
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notification Permission Status */}
        {notificationPermission !== 'granted' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Notifications Disabled</h3>
                  <p className="text-sm text-yellow-700">
                    Enable browser notifications to receive real-time alerts for your reminders and events.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                  <option value="read">Read</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="reminder">Reminders</option>
                  <option value="event">Events</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You\'re all caught up! No notifications to show.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map(notification => (
              <Card key={notification.id} className={`transition-all hover:shadow-md ${
                (notification.status || 'pending') === 'read' ? 'opacity-60' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStatusIcon(notification.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-medium ${
                          (notification.status || 'pending') === 'read' ? 'text-muted-foreground' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          
                          <Badge variant="secondary">
                            {notification.type}
                          </Badge>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(notification.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {notification.scheduled_for && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Scheduled: {format(new Date(notification.scheduled_for), 'MMM d, h:mm a')}
                          </div>
                        )}
                        
                        {notification.sent_at && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Sent: {format(new Date(notification.sent_at), 'MMM d, h:mm a')}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          Created: {format(new Date(notification.created_at), 'MMM d')}
                        </div>
                      </div>
                      
                      {notification.action_url && (
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(notification.action_url, '_blank')}
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {notifications.filter(n => (n.status || 'pending') === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => (n.status || 'pending') === 'sent').length}
                </div>
                <div className="text-sm text-muted-foreground">Sent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {notifications.filter(n => (n.status || 'pending') === 'failed').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priority === 'urgent').length}
                </div>
                <div className="text-sm text-muted-foreground">Urgent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}