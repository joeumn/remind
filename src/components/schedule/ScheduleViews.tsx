'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  List, 
  Filter, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Plus,
  Zap,
  AlertTriangle,
  CheckCircle,
  Circle
} from 'lucide-react'
import { Event } from '@/types'
import { Task } from '@/store'
import { formatDate, formatTime, isEventToday, isEventUpcoming, sortEventsByPriority } from '@/lib/utils/date'
import { getScheduleOptimizer, ScheduleAnalysis } from '@/lib/ai/scheduleOptimizer'

export type ViewMode = 'today' | 'tasks' | 'week' | 'month' | 'all'
export type FilterMode = 'all' | 'events' | 'tasks' | 'urgent' | 'category'
export type CategoryFilter = 'all' | 'Work' | 'Court' | 'Family' | 'Personal' | 'Recovery' | 'Other'

interface ScheduleViewsProps {
  events: Event[]
  tasks: Task[]
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  onCreateEvent?: () => void
  onCreateTask?: () => void
}

export function ScheduleViews({ 
  events, 
  tasks, 
  selectedDate = new Date(),
  onDateChange,
  onCreateEvent,
  onCreateTask
}: ScheduleViewsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [showOptimizations, setShowOptimizations] = useState(false)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)

  const optimizer = getScheduleOptimizer()

  // Filter and sort data based on current view and filters
  const filteredData = useMemo(() => {
    let filteredEvents = [...events]
    let filteredTasks = [...tasks]

    // Apply date filters based on view mode
    switch (viewMode) {
      case 'today':
        filteredEvents = events.filter(isEventToday)
        break
      case 'week':
        const weekStart = new Date(selectedDate)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.start_date)
          return eventDate >= weekStart && eventDate <= weekEnd
        })
        break
      case 'month':
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.start_date)
          return eventDate >= monthStart && eventDate <= monthEnd
        })
        break
      case 'all':
        // Show all events
        break
    }

    // Apply content filters
    switch (filterMode) {
      case 'events':
        filteredTasks = []
        break
      case 'tasks':
        filteredEvents = []
        break
      case 'urgent':
        filteredEvents = filteredEvents.filter(e => e.priority === 'Urgent')
        filteredTasks = filteredTasks.filter(t => t.priority === 'Urgent')
        break
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredEvents = filteredEvents.filter(e => e.category === categoryFilter)
    }

    // Filter completed tasks
    if (!showCompletedTasks) {
      filteredTasks = filteredTasks.filter(t => !t.completed)
    }

    // Sort events by priority and time
    filteredEvents = sortEventsByPriority(filteredEvents)

    return { events: filteredEvents, tasks: filteredTasks }
  }, [events, tasks, viewMode, filterMode, categoryFilter, selectedDate, showCompletedTasks])

  // Calculate schedule analysis
  const scheduleAnalysis = useMemo(() => {
    if (viewMode === 'today' || viewMode === 'week') {
      return optimizer.analyzeSchedule(filteredData.events)
    }
    return null
  }, [filteredData.events, viewMode, optimizer])

  const viewModes = [
    { id: 'today' as ViewMode, label: 'Today', icon: Clock },
    { id: 'tasks' as ViewMode, label: 'Tasks', icon: List },
    { id: 'week' as ViewMode, label: 'Week', icon: Calendar },
    { id: 'month' as ViewMode, label: 'Month', icon: Calendar },
    { id: 'all' as ViewMode, label: 'All', icon: Eye }
  ]

  const filterModes = [
    { id: 'all' as FilterMode, label: 'All' },
    { id: 'events' as FilterMode, label: 'Events' },
    { id: 'tasks' as FilterMode, label: 'Tasks' },
    { id: 'urgent' as FilterMode, label: 'Urgent' }
  ]

  const categories = [
    'all', 'Work', 'Court', 'Family', 'Personal', 'Recovery', 'Other'
  ] as CategoryFilter[]

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        {viewModes.map((mode) => {
          const Icon = mode.icon
          return (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === mode.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {mode.label}
            </button>
          )
        })}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Mode */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filterModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Show Completed Tasks Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showCompletedTasks}
            onChange={(e) => setShowCompletedTasks(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show Completed</span>
        </label>

        {/* Optimization Toggle */}
        <button
          onClick={() => setShowOptimizations(!showOptimizations)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
            showOptimizations
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          Optimizations
        </button>
      </div>

      {/* Schedule Analysis */}
      {scheduleAnalysis && showOptimizations && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Schedule Analysis</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              scheduleAnalysis.overallScore >= 80 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : scheduleAnalysis.overallScore >= 60
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              Score: {scheduleAnalysis.overallScore}/100
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {scheduleAnalysis.totalEvents}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {scheduleAnalysis.conflicts}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {scheduleAnalysis.energyScore}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Energy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {scheduleAnalysis.deadlineRisk}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Risk</div>
            </div>
          </div>

          {scheduleAnalysis.recommendations.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Recommendations:</h4>
              {scheduleAnalysis.recommendations.map((rec, index) => (
                <p key={index} className="text-sm text-blue-700 dark:text-blue-300">
                  • {rec}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Events */}
        {filteredData.events.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Events ({filteredData.events.length})
            </h3>
            <div className="space-y-2">
              {filteredData.events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.priority === 'Urgent' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : event.priority === 'High'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : event.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {event.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {event.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(new Date(event.start_date))}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(new Date(event.start_date))}
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {filteredData.tasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tasks ({filteredData.tasks.length})
            </h3>
            <div className="space-y-2">
              {filteredData.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all ${
                    task.completed 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button className="mt-1">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-green-600 dark:hover:text-green-400" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        task.completed 
                          ? 'text-green-800 dark:text-green-200 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'Urgent' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : task.priority === 'High'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {task.priority}
                        </span>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Created {formatDate(new Date(task.created_at))}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredData.events.length === 0 && filteredData.tasks.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {viewMode === 'today' ? 'You have nothing scheduled for today.' : 
               viewMode === 'tasks' ? 'No tasks to show.' :
               'No events or tasks match your current filters.'}
            </p>
            <div className="flex justify-center gap-3">
              {onCreateEvent && (
                <button
                  onClick={onCreateEvent}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              )}
              {onCreateTask && (
                <button
                  onClick={onCreateTask}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
