import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  subHours,
  subMinutes,
  isWithinInterval,
  isSameDay,
} from 'date-fns'
import { Event, ReminderUnit } from '@/types'

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  return format(new Date(date), formatStr)
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'p')
}

export function getDateRange(date: Date, view: 'day' | 'week' | 'month') {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) }
    case 'week':
      return { start: startOfWeek(date), end: endOfWeek(date) }
    case 'month':
      return { start: startOfMonth(date), end: endOfMonth(date) }
  }
}

export function filterEventsByDateRange(events: Event[], start: Date, end: Date): Event[] {
  return events.filter((event) =>
    isWithinInterval(new Date(event.start_date), { start, end })
  )
}

export function calculateReminderDate(
  eventDate: string,
  value: number,
  unit: ReminderUnit
): Date {
  const date = new Date(eventDate)
  
  switch (unit) {
    case 'minutes':
      return subMinutes(date, value)
    case 'hours':
      return subHours(date, value)
    case 'days':
      return subDays(date, value)
    case 'weeks':
      return subDays(date, value * 7)
  }
}

export function isEventToday(event: Event): boolean {
  return isSameDay(new Date(event.start_date), new Date())
}

export function isEventUpcoming(event: Event, days: number = 7): boolean {
  const eventDate = new Date(event.start_date)
  const today = new Date()
  const futureDate = addDays(today, days)
  
  return isWithinInterval(eventDate, { start: today, end: futureDate })
}

export function getEventsByCategory(events: Event[], category: string): Event[] {
  return events.filter((event) => event.category === category)
}

export function sortEventsByDate(events: Event[]): Event[] {
  return [...events].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )
}

export function sortEventsByPriority(events: Event[]): Event[] {
  const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
  return [...events].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}
