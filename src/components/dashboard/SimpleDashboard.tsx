'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, AlertCircle, Check } from 'lucide-react'
import { format, addDays, startOfDay, isToday, isFuture } from 'date-fns'

// Simplified Event Type
interface SimpleEvent {
  id: string
  title: string
  date: Date
  category: 'Court' | 'Work' | 'Family' | 'Personal' | 'Recovery'
  priority: 'Urgent' | 'High' | 'Medium' | 'Low'
  completed: boolean
}

// Category colors
const categoryColors = {
  Court: 'bg-red-100 text-red-800 border-red-300',
  Work: 'bg-blue-100 text-blue-800 border-blue-300',
  Family: 'bg-green-100 text-green-800 border-green-300',
  Personal: 'bg-purple-100 text-purple-800 border-purple-300',
  Recovery: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

// Priority colors
const priorityColors = {
  Urgent: 'border-l-4 border-l-red-500',
  High: 'border-l-4 border-l-orange-500',
  Medium: 'border-l-4 border-l-yellow-500',
  Low: 'border-l-4 border-l-green-500',
}

export function SimpleDashboard() {
  const [events, setEvents] = useState<SimpleEvent[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    category: 'Personal' as SimpleEvent['category'],
    priority: 'Medium' as SimpleEvent['priority'],
  })

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('remind_events')
    if (stored) {
      const parsed = JSON.parse(stored)
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    } else {
      // Add sample events
      const sampleEvents: SimpleEvent[] = [
        {
          id: '1',
          title: 'Court Hearing - Smith Case',
          date: addDays(new Date(), 2),
          category: 'Court',
          priority: 'Urgent',
          completed: false,
        },
        {
          id: '2',
          title: 'Client Meeting',
          date: new Date(),
          category: 'Work',
          priority: 'High',
          completed: false,
        },
        {
          id: '3',
          title: 'Family Dinner',
          date: addDays(new Date(), 1),
          category: 'Family',
          priority: 'Medium',
          completed: false,
        },
      ]
      setEvents(sampleEvents)
      localStorage.setItem('remind_events', JSON.stringify(sampleEvents))
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('remind_events', JSON.stringify(events))
    }
  }, [events])

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      alert('Please enter a title')
      return
    }

    const dateTime = new Date(`${newEvent.date}T${newEvent.time}`)
    const event: SimpleEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: dateTime,
      category: newEvent.category,
      priority: newEvent.priority,
      completed: false,
    }

    setEvents([...events, event])
    setShowAddModal(false)
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      category: 'Personal',
      priority: 'Medium',
    })
  }

  const handleToggleComplete = (id: string) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, completed: !e.completed } : e
    ))
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  // Filter and sort events
  const todayEvents = events.filter(e => isToday(e.date) && !e.completed)
  const upcomingEvents = events.filter(e => isFuture(e.date) && !isToday(e.date) && !e.completed)
  const urgentEvents = events.filter(e => e.priority === 'Urgent' && !e.completed)
  const completedEvents = events.filter(e => e.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RE:MIND</h1>
              <p className="text-sm text-gray-600">Never miss what matters</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Urgent Events Alert */}
        {urgentEvents.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  ⚠️ {urgentEvents.length} Urgent Event{urgentEvents.length > 1 ? 's' : ''}
                </h3>
                <div className="space-y-2">
                  {urgentEvents.map(event => (
                    <div key={event.id} className="text-sm text-red-800">
                      <span className="font-medium">{event.title}</span> - {format(event.date, 'MMM d, h:mm a')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Events */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Today</h2>
            <span className="text-sm text-gray-500">({todayEvents.length})</span>
          </div>
          {todayEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No events today 🎉</p>
          ) : (
            <div className="space-y-3">
              {todayEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onToggle={handleToggleComplete}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
            <span className="text-sm text-gray-500">({upcomingEvents.length})</span>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 10).map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onToggle={handleToggleComplete}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Completed</h2>
              <span className="text-sm text-gray-500">({completedEvents.length})</span>
            </div>
            <div className="space-y-3">
              {completedEvents.slice(0, 5).map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onToggle={handleToggleComplete}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add New Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as SimpleEvent['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Court">Court</option>
                  <option value="Family">Family</option>
                  <option value="Recovery">Recovery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as SimpleEvent['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Event
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Event Card Component
function EventCard({ 
  event, 
  onToggle, 
  onDelete 
}: { 
  event: SimpleEvent
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className={`border rounded-lg p-4 ${priorityColors[event.priority]} ${event.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(event.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            event.completed 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-gray-300 hover:border-blue-600'
          }`}
        >
          {event.completed && <Check className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 ${event.completed ? 'line-through' : ''}`}>
            {event.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[event.category]}`}>
              {event.category}
            </span>
            <span className="text-sm text-gray-600">
              {format(event.date, 'MMM d, h:mm a')}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(event.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}
