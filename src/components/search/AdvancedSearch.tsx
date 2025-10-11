'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { Search, Filter, X, Calendar, Tag, AlertCircle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Event, EventCategory, EventPriority } from '@/types'
import { formatDate } from '@/lib/utils/date'

interface AdvancedSearchProps {
  events: Event[]
  onResults: (results: Event[]) => void
  onClose: () => void
}

interface SearchFilters {
  query: string
  categories: EventCategory[]
  priorities: EventPriority[]
  dateRange: {
    start?: Date
    end?: Date
  }
  completed: 'all' | 'pending' | 'completed'
}

export function AdvancedSearch({ events, onResults, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priorities: [],
    dateRange: {},
    completed: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const filteredEvents = useMemo(() => {
    let results = [...events]

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      results = results.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(event => filters.categories.includes(event.category))
    }

    // Priority filter
    if (filters.priorities.length > 0) {
      results = results.filter(event => filters.priorities.includes(event.priority))
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      results = results.filter(event => {
        const eventDate = new Date(event.start_date)
        if (filters.dateRange.start && eventDate < filters.dateRange.start) return false
        if (filters.dateRange.end && eventDate > filters.dateRange.end) return false
        return true
      })
    }

    return results.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
  }, [events, filters])

  // Debounced search for better performance
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, query }))
    }, 300)
  }, [])

  const handleApplyFilters = useCallback(() => {
    onResults(filteredEvents)
    onClose()
  }, [filteredEvents, onResults, onClose])

  const handleClearFilters = useCallback(() => {
    setFilters({
      query: '',
      categories: [],
      priorities: [],
      dateRange: {},
      completed: 'all'
    })
    onResults(events)
  }, [events, onResults])

  const toggleCategory = (category: EventCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const togglePriority = (priority: EventPriority) => {
    setFilters(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }))
  }

  const categories: EventCategory[] = ['Court', 'Work', 'Family', 'Personal', 'Recovery', 'Other']
  const priorities: EventPriority[] = ['Urgent', 'High', 'Medium', 'Low']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Smart Search</h2>
                <p className="text-blue-100 text-sm">Find any reminder instantly</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Try: 'court dates', 'meetings this week', 'doctor appointments'..."
                defaultValue={filters.query}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            {filters.query && (
              <p className="text-sm text-gray-600 mt-2">
                💡 Searching in titles, descriptions, and locations
              </p>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-6 mb-6">
                  {/* Categories */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            filters.categories.includes(category)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priorities */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {priorities.map(priority => (
                        <button
                          key={priority}
                          onClick={() => togglePriority(priority)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            filters.priorities.includes(priority)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, start: e.target.value ? new Date(e.target.value) : undefined }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          title="Select start date for search range"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, end: e.target.value ? new Date(e.target.value) : undefined }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          title="Select end date for search range"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Preview */}
          {filteredEvents.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Search className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Found {filteredEvents.length} reminder{filteredEvents.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {filteredEvents.length > 5 ? `Showing first 5 of ${filteredEvents.length}` : 'All results shown'}
                  </p>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-3">
                {filteredEvents.slice(0, 5).map((event, index) => (
                  <div key={`${event.id}-${index}`} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{event.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(event.start_date, 'MMM d, h:mm a')}</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {event.category}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        event.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                        event.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredEvents.length > 5 && (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500 bg-gray-100 rounded-lg py-2">
                      ... and {filteredEvents.length - 5} more reminders
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-bold text-lg shadow-lg"
            >
              🔍 Apply Search
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Clear All
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
