'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Square, Trash2, Tag, AlertCircle, Calendar, X } from 'lucide-react'
import { Event, EventCategory, EventPriority } from '@/types'
import { formatDate } from '@/lib/utils/date'

interface BulkOperationsProps {
  events: Event[]
  selectedEvents: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onBulkUpdate: (updates: Partial<Event>, eventIds: string[]) => void
  onBulkDelete: (eventIds: string[]) => void
  onClose: () => void
}

export function BulkOperations({
  events,
  selectedEvents,
  onSelectionChange,
  onBulkUpdate,
  onBulkDelete,
  onClose
}: BulkOperationsProps) {
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [bulkUpdates, setBulkUpdates] = useState({
    category: '' as EventCategory | '',
    priority: '' as EventPriority | '',
    addDays: 0,
    addHours: 0
  })

  const selectedEventsData = events.filter(event => selectedEvents.includes(event.id))
  const isAllSelected = selectedEvents.length === events.length && events.length > 0
  const isPartiallySelected = selectedEvents.length > 0 && selectedEvents.length < events.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(events.map(event => event.id))
    }
  }

  const handleSelectEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      onSelectionChange(selectedEvents.filter(id => id !== eventId))
    } else {
      onSelectionChange([...selectedEvents, eventId])
    }
  }

  const handleBulkUpdate = () => {
    const updates: Partial<Event> = {}
    
    if (bulkUpdates.category) {
      updates.category = bulkUpdates.category
    }
    if (bulkUpdates.priority) {
      updates.priority = bulkUpdates.priority
    }
    if (bulkUpdates.addDays !== 0 || bulkUpdates.addHours !== 0) {
      // Apply time adjustments to all selected events
      const timeAdjustment = bulkUpdates.addDays * 24 * 60 * 60 * 1000 + bulkUpdates.addHours * 60 * 60 * 1000
      updates.start_date = new Date(Date.now() + timeAdjustment).toISOString()
    }

    onBulkUpdate(updates, selectedEvents)
    setShowUpdateForm(false)
    setBulkUpdates({ category: '', priority: '', addDays: 0, addHours: 0 })
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedEvents.length} reminder${selectedEvents.length !== 1 ? 's' : ''}?`)) {
      onBulkDelete(selectedEvents)
      onSelectionChange([])
    }
  }

  const categories: EventCategory[] = ['Court', 'Work', 'Family', 'Personal', 'Recovery', 'Other']
  const priorities: EventPriority[] = ['Urgent', 'High', 'Medium', 'Low']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-6 h-6" />
                Bulk Operations
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedEvents.length} of {events.length} reminders selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close bulk operations"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[60vh]">
          {/* Left Panel - Event List */}
          <div className="flex-1 p-6 border-r border-gray-200 overflow-y-auto">
            {/* Select All */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-3 w-full text-left"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : isPartiallySelected ? (
                  <div className="w-5 h-5 border-2 border-blue-600 rounded bg-blue-100" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">
                  Select All ({events.length} reminders)
                </span>
              </button>
            </div>

            {/* Event List */}
            <div className="space-y-2">
              {events.map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedEvents.includes(event.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectEvent(event.id)}
                >
                  <div className="flex items-center gap-3">
                    {selectedEvents.includes(event.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.start_date, 'MMM d, h:mm a')} • {event.category}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                      event.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="w-80 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            
            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setShowUpdateForm(true)}
                disabled={selectedEvents.length === 0}
                className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Tag className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Update Selected</span>
              </button>
              
              <button
                onClick={handleBulkDelete}
                disabled={selectedEvents.length === 0}
                className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Delete Selected</span>
              </button>
            </div>

            {/* Update Form */}
            <AnimatePresence>
              {showUpdateForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Update Properties</h4>
                    
                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                      <select
                        value={bulkUpdates.category}
                        onChange={(e) => setBulkUpdates(prev => ({ ...prev, category: e.target.value as EventCategory }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                        title="Select category for bulk update"
                      >
                        <option value="">Keep current</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                      <select
                        value={bulkUpdates.priority}
                        onChange={(e) => setBulkUpdates(prev => ({ ...prev, priority: e.target.value as EventPriority }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                        title="Select priority for bulk update"
                      >
                        <option value="">Keep current</option>
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    {/* Time Adjustment */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Time Adjustment</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="number"
                            placeholder="Days"
                            value={bulkUpdates.addDays || ''}
                            onChange={(e) => setBulkUpdates(prev => ({ ...prev, addDays: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Hours"
                            value={bulkUpdates.addHours || ''}
                            onChange={(e) => setBulkUpdates(prev => ({ ...prev, addHours: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleBulkUpdate}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Apply Updates
                      </button>
                      <button
                        onClick={() => setShowUpdateForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
