'use client'

import { useState, useMemo, useCallback } from 'react'
import { useStore } from '@/store'
import { Event } from '@/types'
import { formatDate, isEventToday, isEventUpcoming, sortEventsByPriority } from '@/lib/utils/date'
import { ChevronLeft, ChevronRight, Plus, Search, CheckSquare, Sparkles, AlertCircle, Clock, Calendar } from 'lucide-react'
import { addDays, subDays } from 'date-fns'
import { EventList } from '@/components/events/EventList'
import { FloatingAddButton } from '@/components/ui/FloatingAddButton'
import { QuickAddModal } from '@/components/modals/QuickAddModal'
import { BoothButton } from '@/components/ui/BoothButton'
import { LazyAdvancedSearch } from '@/components/lazy/LazyComponents'
import { LazyBulkOperations } from '@/components/lazy/LazyComponents'
import { LazySmartTemplates } from '@/components/lazy/LazyComponents'
import { Suspense } from 'react'
import { generateEventId } from '@/utils/idGenerator'
import { deduplicateEvents } from '@/utils/eventUtils'
import { UserSettings } from '@/components/settings/UserSettings'
import { AdPlacement } from '@/components/ads/AdPlacement'
import { VoiceCommandHandler } from '@/components/voice/VoiceCommandHandler'
import { FloatingAssistant } from '@/components/assistant/FloatingAssistant'
import { ScheduleViews } from '@/components/schedule/ScheduleViews'
import { ProFeatures } from '@/components/pro/ProFeatures'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { ViralSharing } from '@/components/sharing/ViralSharing'
import { Settings, Share2, Download, Zap, Mic } from 'lucide-react'
import { useDevice } from '@/hooks/useDevice'
import { usePWAInstall } from '@/hooks/useDevice'
import { useSync } from '@/hooks/useSync'

export function DashboardView() {
  const { events: rawEvents, tasks, selectedDate, viewMode, setSelectedDate, setViewMode, addEvent } = useStore()
  
  // Deduplicate events to prevent duplicate key errors
  const events = useMemo(() => deduplicateEvents(rawEvents), [rawEvents])
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Event[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [isSharingOpen, setIsSharingOpen] = useState(false)
  const [showVoiceHandler, setShowVoiceHandler] = useState(false)
  const [showFloatingAssistant, setShowFloatingAssistant] = useState(false)
  const [showProFeatures, setShowProFeatures] = useState(false)
  const [assistantPosition, setAssistantPosition] = useState({ x: 50, y: 50 })
  
  // Device and sync hooks
  const deviceInfo = useDevice()
  const { isInstallable, installPWA } = usePWAInstall()
  const { isOnline, isSyncing, triggerSync } = useSync()

  // Memoized event filtering for better performance
  const todayEvents = useMemo(() => events.filter(isEventToday), [events])
  const upcomingEvents = useMemo(() => 
    events.filter((e) => isEventUpcoming(e, 7) && !isEventToday(e)), [events]
  )
  const urgentEvents = useMemo(() => 
    sortEventsByPriority(events.filter((e) => e.priority === 'Urgent')), [events]
  )

  // Memoized handlers to prevent unnecessary re-renders
  const handlePrevDay = useCallback(() => setSelectedDate(subDays(selectedDate, 1)), [selectedDate, setSelectedDate])
  const handleNextDay = useCallback(() => setSelectedDate(addDays(selectedDate, 1)), [selectedDate, setSelectedDate])
  const handleToday = useCallback(() => setSelectedDate(new Date()), [setSelectedDate])

  const handleSaveQuickReminder = async (reminder: Partial<Event>) => {
    // In a real app, this would call the API
    const newEvent: Event = {
      id: generateEventId(),
      user_id: 'demo-user',
      title: reminder.title ?? 'New reminder',
      category: reminder.category ?? 'Personal',
      priority: reminder.priority ?? 'Medium',
      start_date: reminder.start_date ?? new Date().toISOString(),
      is_all_day: reminder.is_all_day ?? false,
      description: reminder.description ?? '',
      location: reminder.location ?? '',
      end_date: reminder.end_date ?? reminder.start_date ?? new Date().toISOString(),
      recurrence_type: reminder.recurrence_type ?? 'None',
      prep_tasks: reminder.prep_tasks ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    addEvent(newEvent)
    
    // Show success feedback
    alert(`✅ Reminder created: "${newEvent.title}" at ${formatDate(newEvent.start_date, 'PPp')}`)
  }

  // Memoized bulk operations handlers
  const handleBulkUpdate = useCallback((updates: Partial<Event>, eventIds: string[]) => {
    // In a real app, this would call the API
    eventIds.forEach(id => {
      const eventIndex = events.findIndex(e => e.id === id)
      if (eventIndex !== -1) {
        const updatedEvent = { ...events[eventIndex], ...updates }
        addEvent(updatedEvent) // This would be updateEvent in a real app
      }
    })
    setSelectedEvents([])
  }, [events, addEvent])

  const handleBulkDelete = useCallback((eventIds: string[]) => {
    // In a real app, this would call the API
    eventIds.forEach(id => {
      // This would be deleteEvent in a real app
      console.log('Deleting event:', id)
    })
    setSelectedEvents([])
  }, [])

  const handleApplyTemplate = useCallback((template: Partial<Event>) => {
    const newEvent: Event = {
      id: generateEventId(),
      user_id: 'demo-user',
      title: template.title ?? 'Template reminder',
      category: template.category ?? 'Personal',
      priority: template.priority ?? 'Medium',
      start_date: template.start_date ?? new Date().toISOString(),
      is_all_day: template.is_all_day ?? false,
      description: template.description ?? '',
      location: template.location ?? '',
      end_date: template.end_date ?? template.start_date ?? new Date().toISOString(),
      recurrence_type: template.recurrence_type ?? 'None',
      prep_tasks: template.prep_tasks ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    addEvent(newEvent)
    setIsTemplatesOpen(false)
  }, [addEvent])

  return (
    <div className="pb-20">
      {/* Date Navigation */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded-lg" title="Previous day">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(selectedDate, 'EEEE')}
            </h2>
            <p className="text-sm text-gray-500">{formatDate(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-lg" title="Next day">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToday}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Today
          </button>
          <button 
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            title="Add new reminder"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => setIsBulkOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            <CheckSquare className="w-4 h-4" />
            Bulk
          </button>
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => setIsSharingOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
            title="Share RE:MIND"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowVoiceHandler(!showVoiceHandler)}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all shadow-sm hover:shadow-md ${
              showVoiceHandler 
                ? 'text-white bg-blue-500 hover:bg-blue-600' 
                : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            } rounded-xl`}
            title="Voice Commands"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFloatingAssistant(!showFloatingAssistant)}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all shadow-sm hover:shadow-md ${
              showFloatingAssistant 
                ? 'text-white bg-purple-500 hover:bg-purple-600' 
                : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            } rounded-xl`}
            title="Floating Assistant"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowProFeatures(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md rounded-xl"
            title="Pro Features"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 px-4 pt-4 mb-4">
        {(['day', 'week', 'month'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg capitalize ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Urgent Alerts */}
      {urgentEvents.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-600">
                ⚠️ Urgent Events
              </h3>
              <p className="text-sm text-red-500">
                {urgentEvents.length} urgent reminder{urgentEvents.length !== 1 ? 's' : ''} need your attention
              </p>
            </div>
          </div>
          <EventList
            events={urgentEvents}
            viewMode="day"
            selectedDate={selectedDate}
          />
        </div>
      )}

      {/* Main Schedule View */}
      <div className="px-4 mb-6">
        <ScheduleViews
          events={events}
          tasks={tasks}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onCreateEvent={() => setIsQuickAddOpen(true)}
          onCreateTask={() => setIsQuickAddOpen(true)}
        />
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                🔮 Coming Up
              </h3>
              <p className="text-sm text-gray-600">
                {upcomingEvents.length} reminder{upcomingEvents.length !== 1 ? 's' : ''} in the next 7 days
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 5).map((event, index) => (
              <div key={`${event.id}-${index}`} className="p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(event.start_date, 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {event.category}
                  </span>
                </div>
              </div>
            ))}
            {upcomingEvents.length > 5 && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">
                  ... and {upcomingEvents.length - 5} more reminders
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Clock className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-800">{todayEvents.length}</p>
                <p className="text-sm font-semibold text-blue-600">Today</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-800">{upcomingEvents.length}</p>
                <p className="text-sm font-semibold text-purple-600">This Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Add Button */}
      <FloatingAddButton onClick={() => setIsQuickAddOpen(true)} />

      {/* Booth Demo Button */}
      <BoothButton />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSave={handleSaveQuickReminder}
      />

      {/* Advanced Search Modal */}
      {isSearchOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-6 rounded-xl">Loading search...</div></div>}>
          <LazyAdvancedSearch
            events={events}
            onResults={setSearchResults}
            onClose={() => setIsSearchOpen(false)}
          />
        </Suspense>
      )}

      {/* Bulk Operations Modal */}
      {isBulkOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-6 rounded-xl">Loading bulk operations...</div></div>}>
          <LazyBulkOperations
            events={events}
            selectedEvents={selectedEvents}
            onSelectionChange={setSelectedEvents}
            onBulkUpdate={handleBulkUpdate}
            onBulkDelete={handleBulkDelete}
            onClose={() => setIsBulkOpen(false)}
          />
        </Suspense>
      )}

      {/* Smart Templates Modal */}
      {isTemplatesOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-6 rounded-xl">Loading templates...</div></div>}>
          <LazySmartTemplates
            onApplyTemplate={handleApplyTemplate}
            onClose={() => setIsTemplatesOpen(false)}
            recentEvents={events}
          />
        </Suspense>
      )}

      {/* User Settings Modal */}
      <UserSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Onboarding Flow */}
      <OnboardingFlow isOpen={isOnboardingOpen} onComplete={() => setIsOnboardingOpen(false)} />

      {/* Viral Sharing Modal */}
      <ViralSharing isOpen={isSharingOpen} onClose={() => setIsSharingOpen(false)} />

      {/* Voice Command Handler */}
      {showVoiceHandler && (
        <div className="fixed bottom-20 right-4 z-40 max-w-sm">
          <VoiceCommandHandler 
            onEventsCreated={(events) => {
              console.log('Voice created events:', events)
              setShowVoiceHandler(false)
            }}
            onTasksCreated={(tasks) => {
              console.log('Voice created tasks:', tasks)
              setShowVoiceHandler(false)
            }}
          />
        </div>
      )}

      {/* Floating Assistant */}
      <FloatingAssistant
        isVisible={showFloatingAssistant}
        onToggle={() => setShowFloatingAssistant(!showFloatingAssistant)}
        position={assistantPosition}
        onPositionChange={setAssistantPosition}
        isProUser={false} // This would come from user settings
      />

      {/* Pro Features Modal */}
      <ProFeatures
        isOpen={showProFeatures}
        onClose={() => setShowProFeatures(false)}
        currentPlan="free" // This would come from user settings
      />

      {/* PWA Install Prompt */}
      {isInstallable && !deviceInfo.isPWA && (
        <div className="fixed bottom-4 left-4 right-4 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
            <div>
                <p className="font-semibold">Install RE:MIND</p>
                <p className="text-sm text-blue-100">Get instant access from your home screen</p>
              </div>
            </div>
            <button
              onClick={installPWA}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Sync Status Indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-4 right-4 z-40 bg-orange-500 text-white rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Working offline - changes will sync when online</span>
          </div>
        </div>
      )}

      {/* Top Banner Ad */}
      <div className="px-4 mb-6">
        <AdPlacement type="banner" placement="dashboard-top" />
      </div>

    </div>
  )
}
