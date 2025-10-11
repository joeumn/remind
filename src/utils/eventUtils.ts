import { Event } from '@/types'

/**
 * Remove duplicate events based on ID
 * Keeps the most recent version of each event
 */
export function deduplicateEvents(events: Event[]): Event[] {
  const eventMap = new Map<string, Event>()
  
  // Process events in reverse order to keep the most recent version
  events.reverse().forEach(event => {
    if (!eventMap.has(event.id)) {
      eventMap.set(event.id, event)
    }
  })
  
  // Convert back to array and reverse to maintain original order
  return Array.from(eventMap.values()).reverse()
}

/**
 * Sort events by creation date (newest first)
 */
export function sortEventsByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.created_at || a.start_date)
    const dateB = new Date(b.created_at || b.start_date)
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Validate event data
 */
export function validateEvent(event: Partial<Event>): boolean {
  return !!(
    event.id &&
    event.title &&
    event.start_date &&
    event.category &&
    event.priority
  )
}

/**
 * Get events by category
 */
export function getEventsByCategory(events: Event[], category: string): Event[] {
  return events.filter(event => event.category === category)
}

/**
 * Get events by priority
 */
export function getEventsByPriority(events: Event[], priority: string): Event[] {
  return events.filter(event => event.priority === priority)
}

/**
 * Get events within date range
 */
export function getEventsInDateRange(
  events: Event[], 
  startDate: Date, 
  endDate: Date
): Event[] {
  return events.filter(event => {
    const eventDate = new Date(event.start_date)
    return eventDate >= startDate && eventDate <= endDate
  })
}
