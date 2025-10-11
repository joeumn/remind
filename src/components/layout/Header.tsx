'use client'

import { Menu, Bell } from 'lucide-react'
import { useStore } from '@/store'

export function Header() {
  const notifications = useStore((state) => state.notifications)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          className="p-2 -ml-2 text-gray-700 hover:text-gray-900"
          title="Open menu"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">
          RE:MIND
        </h1>
        
        <button className="relative p-2 -mr-2 text-gray-700 hover:text-gray-900">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
