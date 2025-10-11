'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Repeat, Sparkles, Plus, X, Star } from 'lucide-react'
import { Event, EventCategory, EventPriority } from '@/types'
import { formatDate } from '@/lib/utils/date'

interface SmartTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  template: Partial<Event>
  usage: number
  lastUsed?: Date
  isFavorite?: boolean
  category: EventCategory
  estimatedDuration: number // in minutes
}

interface SmartTemplatesProps {
  onApplyTemplate: (template: Partial<Event>) => void
  onClose: () => void
  recentEvents?: Event[]
}

const defaultTemplates: SmartTemplate[] = [
  {
    id: 'court-hearing',
    name: 'Court Hearing',
    description: 'Legal hearing with multi-layer reminders',
    icon: <Calendar className="w-5 h-5" />,
    template: {
      category: 'Court',
      priority: 'Urgent',
      title: 'Court Hearing',
      description: 'Important legal proceeding',
      is_all_day: false
    },
    usage: 0,
    category: 'Court',
    estimatedDuration: 120
  },
  {
    id: 'client-meeting',
    name: 'Client Meeting',
    description: 'Professional client consultation',
    icon: <Clock className="w-5 h-5" />,
    template: {
      category: 'Work',
      priority: 'High',
      title: 'Client Meeting',
      description: 'Client consultation and project discussion',
      is_all_day: false
    },
    usage: 0,
    category: 'Work',
    estimatedDuration: 60
  },
  {
    id: 'family-dinner',
    name: 'Family Dinner',
    description: 'Quality time with family',
    icon: <Star className="w-5 h-5" />,
    template: {
      category: 'Family',
      priority: 'Medium',
      title: 'Family Dinner',
      description: 'Evening meal with family',
      is_all_day: false
    },
    usage: 0,
    category: 'Family',
    estimatedDuration: 90
  },
  {
    id: 'doctor-appointment',
    name: 'Doctor Appointment',
    description: 'Medical checkup and consultation',
    icon: <Calendar className="w-5 h-5" />,
    template: {
      category: 'Recovery',
      priority: 'High',
      title: 'Doctor Appointment',
      description: 'Medical consultation and checkup',
      is_all_day: false
    },
    usage: 0,
    category: 'Recovery',
    estimatedDuration: 45
  },
  {
    id: 'workout-session',
    name: 'Workout Session',
    description: 'Exercise and fitness routine',
    icon: <Repeat className="w-5 h-5" />,
    template: {
      category: 'Recovery',
      priority: 'Medium',
      title: 'Workout Session',
      description: 'Regular exercise and fitness routine',
      is_all_day: false
    },
    usage: 0,
    category: 'Recovery',
    estimatedDuration: 60
  },
  {
    id: 'project-deadline',
    name: 'Project Deadline',
    description: 'Important project milestone',
    icon: <Clock className="w-5 h-5" />,
    template: {
      category: 'Work',
      priority: 'Urgent',
      title: 'Project Deadline',
      description: 'Critical project milestone completion',
      is_all_day: true
    },
    usage: 0,
    category: 'Work',
    estimatedDuration: 480
  }
]

export function SmartTemplates({ onApplyTemplate, onClose, recentEvents = [] }: SmartTemplatesProps) {
  const [templates, setTemplates] = useState<SmartTemplate[]>(defaultTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'Personal' as EventCategory,
    priority: 'Medium' as EventPriority,
    estimatedDuration: 60
  })

  // Generate smart suggestions based on recent events
  const smartSuggestions = recentEvents
    .filter(event => new Date(event.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
    .reduce((acc, event) => {
      const key = `${event.category}-${event.title.toLowerCase()}`
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          event: event,
          lastUsed: new Date(event.start_date)
        }
      }
      acc[key].count++
      return acc
    }, {} as Record<string, { count: number; event: Event; lastUsed: Date }>)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleApplyTemplate = (template: SmartTemplate) => {
    // Update usage statistics
    setTemplates(prev => prev.map(t => 
      t.id === template.id 
        ? { ...t, usage: t.usage + 1, lastUsed: new Date() }
        : t
    ))
    
    // Apply the template with current time
    const now = new Date()
    const templateWithTime = {
      ...template.template,
      start_date: now.toISOString(),
      end_date: new Date(now.getTime() + template.estimatedDuration * 60000).toISOString()
    }
    
    onApplyTemplate(templateWithTime)
    onClose()
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) return

    const template: SmartTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      icon: <Sparkles className="w-5 h-5" />,
      template: {
        category: newTemplate.category,
        priority: newTemplate.priority,
        title: newTemplate.name,
        description: newTemplate.description,
        is_all_day: false
      },
      usage: 0,
      category: newTemplate.category,
      estimatedDuration: newTemplate.estimatedDuration
    }

    setTemplates(prev => [template, ...prev])
    setShowCreateForm(false)
    setNewTemplate({
      name: '',
      description: '',
      category: 'Personal',
      priority: 'Medium',
      estimatedDuration: 60
    })
  }

  const categories: EventCategory[] = ['Court', 'Work', 'Family', 'Personal', 'Recovery', 'Other']

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
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Smart Templates
              </h2>
              <p className="text-gray-600 mt-1">
                Quick-start reminders for common activities
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'All')}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create
            </button>
          </div>

          {/* Smart Suggestions */}
          {Object.keys(smartSuggestions).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Based on Your Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(smartSuggestions).slice(0, 4).map(([key, suggestion]) => (
                  <div
                    key={key}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleApplyTemplate({
                      id: `suggestion-${key}`,
                      name: suggestion.event.title,
                      description: `Used ${suggestion.count} times recently`,
                      icon: <Star className="w-5 h-5" />,
                      template: {
                        category: suggestion.event.category,
                        priority: suggestion.event.priority,
                        title: suggestion.event.title,
                        description: suggestion.event.description,
                        is_all_day: suggestion.event.is_all_day
                      },
                      usage: suggestion.count,
                      lastUsed: suggestion.lastUsed,
                      category: suggestion.event.category,
                      estimatedDuration: 60
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{suggestion.event.title}</p>
                        <p className="text-sm text-blue-700">{suggestion.event.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-600">{suggestion.count}x used</p>
                        <p className="text-xs text-blue-500">
                          {formatDate(suggestion.lastUsed, 'MMM d')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                onClick={() => handleApplyTemplate(template)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.estimatedDuration} min</p>
                    </div>
                  </div>
                  {template.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {template.category}
                  </span>
                  {template.usage > 0 && (
                    <span className="text-xs text-gray-500">
                      {template.usage} uses
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create Template Form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Create Template</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Weekly Team Meeting"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                      <input
                        type="text"
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the activity"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                        <select
                          value={newTemplate.category}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as EventCategory }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                        <select
                          value={newTemplate.priority}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, priority: e.target.value as EventPriority }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Duration (minutes)</label>
                      <input
                        type="number"
                        value={newTemplate.estimatedDuration}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleCreateTemplate}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Template
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
