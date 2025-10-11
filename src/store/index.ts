import { create } from 'zustand'
import { Event, Notification, UserPreferences } from '@/types'

export interface Task {
  id: string
  title: string
  completed: boolean
  created_at: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
}

interface AppState {
  events: Event[]
  tasks: Task[]
  notifications: Notification[]
  userPreferences: UserPreferences | null
  selectedDate: Date
  viewMode: 'day' | 'week' | 'month'
  
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  setNotifications: (notifications: Notification[]) => void
  markNotificationAsRead: (id: string) => void
  
  setUserPreferences: (preferences: UserPreferences) => void
  setSelectedDate: (date: Date) => void
  setViewMode: (mode: 'day' | 'week' | 'month') => void
}

export const useStore = create<AppState>((set) => ({
  events: [],
  tasks: [],
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
  
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
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
