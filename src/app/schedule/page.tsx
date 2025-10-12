'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-react'
import { QuickAddReminder } from '@/components/quick-add-reminder'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface Event {
  id: string
  title: string
  description?: string
  start_at: string
  end_at?: string
  all_day: boolean
  location?: string
  attendees: string[]
  event_type: string
  priority: string
  status: string
  category?: string
  tags: string[]
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add empty days at the start to align calendar
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())
  const calendarDays = eachDayOfInterval({ 
    start: startDate, 
    end: new Date(monthEnd.getTime() + (6 - monthEnd.getDay()) * 24 * 60 * 60 * 1000)
  })

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const startDate = startOfMonth(currentDate).toISOString()
      const endDate = endOfMonth(currentDate).toISOString()
      
      const response = await fetch(`/api/events?start_date=${startDate}&end_date=${endDate}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_at)
      return isSameDay(eventDate, date)
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-blue-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'meeting': return 'bg-purple-500'
      case 'task': return 'bg-green-500'
      case 'deadline': return 'bg-red-500'
      case 'personal': return 'bg-pink-500'
      default: return 'bg-blue-500'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schedule</h1>
            <p className="text-muted-foreground">
              View and manage your events and reminders
            </p>
          </div>
          <QuickAddReminder>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </QuickAddReminder>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                      Today
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isToday = isSameDay(day, new Date())
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    
                    return (
                      <div
                        key={index}
                        className={`
                          min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg cursor-pointer transition-colors
                          ${isCurrentMonth ? 'bg-background' : 'bg-muted/50'}
                          ${isToday ? 'ring-2 ring-primary' : ''}
                          ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`
                          text-sm font-medium mb-1
                          ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                          ${isToday ? 'text-primary' : ''}
                        `}>
                          {format(day, 'd')}
                        </div>
                        
                        {/* Event indicators */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${getEventTypeColor(event.event_type)}
                                text-white
                              `}
                              title={event.title}
                            >
                              <span className="hidden sm:inline">{event.title}</span>
                              <span className="sm:hidden">•</span>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No events scheduled
                    </p>
                  ) : (
                    selectedDateEvents.map(event => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                        </div>
                        
                        {event.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {event.all_day ? 'All day' : format(new Date(event.start_at), 'h:mm a')}
                            {event.end_at && !event.all_day && (
                              <> - {format(new Date(event.end_at), 'h:mm a')}</>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          
                          {event.attendees.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Meetings</span>
                  <span className="font-medium">
                    {events.filter(e => e.event_type === 'meeting').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tasks</span>
                  <span className="font-medium">
                    {events.filter(e => e.event_type === 'task').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Deadlines</span>
                  <span className="font-medium">
                    {events.filter(e => e.event_type === 'deadline').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}