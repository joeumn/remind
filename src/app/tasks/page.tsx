'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Flag,
  Tag,
  MoreHorizontal
} from 'lucide-react'
import { QuickAddReminder } from '@/components/quick-add-reminder'
import { format, isToday, isTomorrow, isPast, isFuture } from 'date-fns'

interface Reminder {
  id: string
  title: string
  description?: string
  due_at?: string
  priority: string
  status: string
  category?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export default function TasksPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/reminders')
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComplete = async (reminderId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setReminders(prev => prev.map(r => 
          r.id === reminderId ? { ...r, status: newStatus } : r
        ))
      }
    } catch (error) {
      console.error('Failed to update reminder:', error)
    }
  }

  const handleDelete = async (reminderId: string) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setReminders(prev => prev.filter(r => r.id !== reminderId))
      }
    } catch (error) {
      console.error('Failed to delete reminder:', error)
    }
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

  const getDueDateStatus = (dueAt?: string) => {
    if (!dueAt) return null
    
    const dueDate = new Date(dueAt)
    if (isPast(dueDate) && !isToday(dueDate)) return 'overdue'
    if (isToday(dueDate)) return 'today'
    if (isTomorrow(dueDate)) return 'tomorrow'
    return 'upcoming'
  }

  const getDueDateText = (dueAt?: string) => {
    if (!dueAt) return null
    
    const dueDate = new Date(dueAt)
    if (isToday(dueDate)) return 'Today'
    if (isTomorrow(dueDate)) return 'Tomorrow'
    if (isPast(dueDate)) return `Overdue by ${Math.ceil((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24))} days`
    return format(dueDate, 'MMM d')
  }

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || reminder.status === filterStatus
    const matchesPriority = filterPriority === 'all' || reminder.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || reminder.category === filterCategory

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const categories = Array.from(new Set(reminders.map(r => r.category).filter(Boolean)))

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks and reminders
            </p>
          </div>
          <QuickAddReminder>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </QuickAddReminder>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
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
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading tasks...</p>
            </div>
          ) : filteredReminders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started'
                  }
                </p>
                <QuickAddReminder>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </QuickAddReminder>
              </CardContent>
            </Card>
          ) : (
            filteredReminders.map(reminder => {
              const dueDateStatus = getDueDateStatus(reminder.due_at)
              const dueDateText = getDueDateText(reminder.due_at)
              
              return (
                <Card key={reminder.id} className={`transition-all hover:shadow-md ${
                  reminder.status === 'completed' ? 'opacity-60' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={reminder.status === 'completed'}
                        onCheckedChange={() => handleToggleComplete(reminder.id, reminder.status)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-medium ${
                            reminder.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {reminder.title}
                          </h3>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                              <Flag className="h-3 w-3 mr-1" />
                              {reminder.priority}
                            </Badge>
                            
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(reminder.id)}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {reminder.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {reminder.due_at && (
                            <div className={`flex items-center gap-1 ${
                              dueDateStatus === 'overdue' ? 'text-red-600' : 
                              dueDateStatus === 'today' ? 'text-orange-600' : ''
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {dueDateText}
                            </div>
                          )}
                          
                          {reminder.category && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {reminder.category}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(reminder.created_at), 'MMM d')}
                          </div>
                        </div>
                        
                        {reminder.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {reminder.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {reminders.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {reminders.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {reminders.filter(r => {
                    const dueDateStatus = getDueDateStatus(r.due_at)
                    return dueDateStatus === 'overdue'
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {reminders.filter(r => {
                    const dueDateStatus = getDueDateStatus(r.due_at)
                    return dueDateStatus === 'today'
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">Due Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
