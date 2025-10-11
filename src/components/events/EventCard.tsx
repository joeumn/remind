'use client'

import { Event } from '@/types'
import { formatTime } from '@/lib/utils/date'
import { categoryColors, priorityColors } from '@/lib/constants'
import { Clock, MapPin, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: Event
  onClick?: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const colors = categoryColors[event.category]

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md',
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {event.title}
          </h3>
          <span className={cn('text-xs font-medium', colors.text)}>
            {event.category}
          </span>
        </div>
        {event.priority !== 'Low' && (
          <AlertCircle className={cn('w-5 h-5 ml-2', priorityColors[event.priority])} />
        )}
      </div>

      {event.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="flex flex-col space-y-1 text-xs text-gray-500">
        {!event.is_all_day && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatTime(event.start_date)}</span>
            {event.end_date && <span className="ml-1">- {formatTime(event.end_date)}</span>}
          </div>
        )}
        {event.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </div>
  )
}
