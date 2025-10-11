import { EventCategory } from '@/types'

export const categoryColors: Record<EventCategory, { bg: string; text: string; border: string }> = {
  Court: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  Work: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  Family: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  Personal: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  Recovery: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  Other: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
}

export const priorityColors = {
  Low: 'text-gray-500',
  Medium: 'text-yellow-600',
  High: 'text-orange-600',
  Urgent: 'text-red-600',
}

export const defaultReminders = [
  { value: 14, unit: 'days' as const },
  { value: 7, unit: 'days' as const },
  { value: 3, unit: 'days' as const },
  { value: 1, unit: 'days' as const },
  { value: 2, unit: 'hours' as const },
  { value: 1, unit: 'hours' as const },
]
