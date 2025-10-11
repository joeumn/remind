'use client'

import { Event } from '@/types'
import { EventCard } from './EventCard'
import { sortEventsByDate, filterEventsByDateRange, getDateRange } from '@/lib/utils/date'

interface EventListProps {
  events: Event[]
  viewMode: 'day' | 'week' | 'month'
  selectedDate: Date
  onEventClick?: (event: Event) => void
}

export function EventList({ events, viewMode, selectedDate, onEventClick }: EventListProps) {
  const { start, end } = getDateRange(selectedDate, viewMode)
  const filteredEvents = sortEventsByDate(filterEventsByDateRange(events, start, end))

  if (filteredEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 mb-2">No events scheduled</p>
        <p className="text-sm text-gray-400">Add your first event to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map((event, index) => (
        <EventCard
          key={`${event.id}-${index}`}
          event={event}
          onClick={() => onEventClick?.(event)}
        />
      ))}
    </div>
  )
}
