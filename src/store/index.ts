import { create } from 'zustand'
import { Event, Notification, UserPreferences } from '@/types'

interface AppState {
  events: Event[]
  notifications: Notification[]
  userPreferences: UserPreferences | null
  selectedDate: Date
  viewMode: 'day' | 'week' | 'month'
  
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  
  setNotifications: (notifications: Notification[]) => void
  markNotificationAsRead: (id: string) => void
  
  setUserPreferences: (preferences: UserPreferences) => void
  setSelectedDate: (date: Date) => void
  setViewMode: (mode: 'day' | 'week' | 'month') => void
}

export const useStore = create<AppState>((set) => ({
  events: [],
  notifications: [],
  userPreferences: null,
  selectedDate: new Date(),
  viewMode: 'day',
  
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  
  setNotifications: (notifications) => set({ notifications }),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true, read_at: new Date().toISOString() }
          : notification
      ),
    })),
  
  setUserPreferences: (userPreferences) => set({ userPreferences }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setViewMode: (viewMode) => set({ viewMode }),
}))
