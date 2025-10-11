export type EventCategory = 'Court' | 'Work' | 'Family' | 'Personal' | 'Recovery' | 'Other'
export type EventPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type RecurrenceType = 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
export type ReminderUnit = 'minutes' | 'hours' | 'days' | 'weeks'

export interface Event {
  id: string
  user_id: string
  title: string
  description?: string
  category: EventCategory
  priority: EventPriority
  start_date: string
  end_date?: string
  location?: string
  is_all_day: boolean
  recurrence_type: RecurrenceType
  recurrence_end_date?: string
  prep_tasks?: string[]
  accountability_partner_email?: string
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  event_id: string
  user_id: string
  remind_at: string
  value: number
  unit: ReminderUnit
  is_sent: boolean
  sent_at?: string
  notification_channels: ('push' | 'email' | 'sms')[]
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  event_id?: string
  reminder_id?: string
  title: string
  message: string
  type: 'reminder' | 'info' | 'alert'
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  default_reminders: {
    value: number
    unit: ReminderUnit
  }[]
  notification_channels: ('push' | 'email' | 'sms')[]
  email_notifications_enabled: boolean
  sms_notifications_enabled: boolean
  push_notifications_enabled: boolean
  daily_briefing_enabled: boolean
  daily_briefing_time: string
  weekly_briefing_enabled: boolean
  weekly_briefing_day: number
  timezone: string
  created_at: string
  updated_at: string
}
