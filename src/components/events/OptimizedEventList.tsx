'use client'

import React, { memo, useMemo } from 'react'
import { Event } from '@/types'
import { formatDate } from '@/lib/utils/date'
import { categoryColors } from '@/lib/constants'
import { motion } from 'framer-motion'

interface OptimizedEventListProps {
  events: Event[]
  viewMode: 'day' | 'week' | 'month'
  selectedDate: Date
}

// Memoized individual event item to prevent unnecessary re-renders
const EventItem = memo(({ event }: { event: Event }) => {
  const categoryColor = categoryColors[event.category]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${categoryColor.bg} ${categoryColor.border}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${categoryColor.text} truncate`}>
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(event.start_date, 'h:mm a')}
          </p>
          {event.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 ml-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            event.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
            event.priority === 'High' ? 'bg-orange-100 text-orange-700' :
            event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {event.priority}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${categoryColor.text} ${categoryColor.bg}`}>
            {event.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
})

EventItem.displayName = 'EventItem'

export const OptimizedEventList = memo(function OptimizedEventList({ 
  events, 
  viewMode, 
  selectedDate 
}: OptimizedEventListProps) {
  // Memoize sorted events to prevent unnecessary sorting
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const timeA = new Date(a.start_date).getTime()
      const timeB = new Date(b.start_date).getTime()
      return timeA - timeB
    })
  }, [events])

  // Early return for empty list
  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No reminders for this time period</p>
        <p className="text-gray-400 text-sm mt-1">Create your first reminder to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  )
})
