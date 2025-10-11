'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { X, Tag, AlertCircle, Sparkles, Mic, Zap, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Event, EventCategory, EventPriority } from '@/types'
import { categoryColors } from '@/lib/constants'
import { parseNaturalLanguage } from '@/lib/utils/naturalLanguage'
import { formatDate } from '@/lib/utils/date'
import { analyzeTextForCategory, getCategoryEmoji } from '@/lib/utils/smartCategorization'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (reminder: Partial<Event>) => void
}

const quickTemplates = [
  { label: '30 min', minutes: 30, icon: '⚡' },
  { label: '1 hour', minutes: 60, icon: '⏰' },
  { label: '3 hours', minutes: 180, icon: '🕐' },
  { label: 'Tomorrow 9am', hours: 24, time: '09:00', icon: '🌅' },
  { label: 'This Evening', hours: 6, time: '18:00', icon: '🌆' },
  { label: 'Next Week', days: 7, icon: '📅' },
]

export function QuickAddModal({ isOpen, onClose, onSave }: QuickAddModalProps) {
  const [title, setTitle] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [category, setCategory] = useState<EventCategory>('Personal')
  const [priority, setPriority] = useState<EventPriority>('Medium')
  const [parsedSuggestion, setParsedSuggestion] = useState<{ title: string; date: Date; confidence: number } | null>(null)

  // Debounced natural language parsing for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (title.length > 5) {
        const parsed = parseNaturalLanguage(title)
        if (parsed.confidence > 0.6) {
          setParsedSuggestion(parsed)
        } else {
          setParsedSuggestion(null)
        }

        // Auto-categorize based on content
        const categoryAnalysis = analyzeTextForCategory(title)
        if (categoryAnalysis.confidence > 0.7) {
          setCategory(categoryAnalysis.category)
        }
      } else {
        setParsedSuggestion(null)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [title])

  // Memoized category analysis to avoid recalculation
  const categoryAnalysis = useMemo(() => 
    title.length > 5 ? analyzeTextForCategory(title) : null, [title]
  )

  const handleQuickAdd = useCallback((template: typeof quickTemplates[number]) => {
    const now = new Date()
    const reminderDate = new Date(now)

    if (template.minutes) {
      reminderDate.setMinutes(reminderDate.getMinutes() + template.minutes)
    } else if (template.hours) {
      reminderDate.setHours(reminderDate.getHours() + template.hours)
      if (template.time) {
        const [hours, minutes] = template.time.split(':')
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      }
    } else if (template.days) {
      reminderDate.setDate(reminderDate.getDate() + template.days)
      reminderDate.setHours(9, 0, 0, 0)
    }

    const reminder = {
      title: title || `Quick reminder`,
      start_date: reminderDate.toISOString(),
      category,
      priority,
      is_all_day: false,
    }

    onSave(reminder)
    handleClose()
  }, [title, category, priority, onSave])

  const handleVoiceInput = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTitle(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert('Voice input not supported in your browser. Try Chrome or Edge.')
    }
  }, [])

  const handleClose = useCallback(() => {
    setTitle('')
    setShowAdvanced(false)
    setParsedSuggestion(null)
    onClose()
  }, [onClose])

  const handleUseParsedSuggestion = useCallback(() => {
    if (!parsedSuggestion) return

    const reminder = {
      title: parsedSuggestion.title,
      start_date: parsedSuggestion.date.toISOString(),
      category,
      priority,
      is_all_day: false,
    }

    onSave(reminder)
    handleClose()
  }, [parsedSuggestion, category, priority, onSave, handleClose])

  const handleSaveCustom = useCallback(() => {
    if (!title.trim()) return

    const reminder = {
      title: title.trim(),
      start_date: new Date(Date.now() + 3600000).toISOString(), // 1 hour default
      category,
      priority,
      is_all_day: false,
    }

    onSave(reminder)
    handleClose()
  }, [title, category, priority, onSave, handleClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 30, 
            stiffness: 400,
            mass: 0.8
          }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
          style={{ willChange: 'transform, opacity' }}
        >
           {/* Header */}
           <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-xl">
                 <Sparkles className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-xl font-bold">Add Reminder</h2>
                 <p className="text-blue-100 text-sm">Just speak or type naturally</p>
               </div>
             </div>
             <button
               onClick={handleClose}
               className="p-2 hover:bg-white/20 rounded-full transition-colors"
               title="Close modal"
             >
               <X className="w-6 h-6" />
             </button>
           </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Main Input Section */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Try: 'Call mom tomorrow at 3pm' or 'Meeting in 2 hours'"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                  autoFocus
                />
                <button
                  onClick={handleVoiceInput}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all shadow-lg ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse scale-110'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105'
                  }`}
                  title="Tap to speak your reminder"
                >
                  <Mic className="w-6 h-6" />
                </button>
              </div>
              
              {/* Voice Status */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-red-700 font-medium">
                      🎤 Listening... Speak your reminder now!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Input Tips */}
              {!title && !isListening && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Examples:</strong> &quot;Meeting tomorrow at 2pm&quot;, &quot;Call dentist next Monday&quot;, &quot;Pick up kids in 30 minutes&quot;
                  </p>
                </div>
              )}
              
              {/* Smart Suggestions */}
              {parsedSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-900 mb-2">
                        ✨ Smart Suggestion
                      </p>
                      <p className="text-base text-green-800 mb-2">
                        <strong>&quot;{parsedSuggestion.title}&quot;</strong>
                      </p>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(parsedSuggestion.date, 'PPp')}
                      </p>
                    </div>
                    <button
                      onClick={handleUseParsedSuggestion}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                    >
                      Use This ✨
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Smart Category Suggestion */}
              {categoryAnalysis && categoryAnalysis.confidence > 0.7 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-900 mb-1">
                        🎯 Auto-Category
                      </p>
                      <p className="text-base text-blue-800">
                        {getCategoryEmoji(categoryAnalysis.category)} {categoryAnalysis.category}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        I think this is a {categoryAnalysis.category.toLowerCase()} activity
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Templates */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                Quick Times
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickTemplates.map((template) => (
                  <button
                    key={template.label}
                    onClick={() => handleQuickAdd(template)}
                    disabled={!title.trim()}
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-2xl border-2 border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">
                      {template.icon}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 text-center">
                      {template.label}
                    </span>
                  </button>
                ))}
              </div>
              {!title.trim() && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  💡 Type something first to use quick times
                </p>
              )}
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
              >
                {showAdvanced ? (
                  <>
                    <span>−</span>
                    <span>Less Options</span>
                  </>
                ) : (
                  <>
                    <span>+</span>
                    <span>More Options</span>
                  </>
                )}
              </button>
            </div>

            {/* Advanced Options */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pb-4">
                    {/* Category Selection */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Category
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(categoryColors) as EventCategory[]).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`p-2 rounded-lg text-sm font-medium transition-all ${
                              category === cat
                                ? `${categoryColors[cat].bg} ${categoryColors[cat].text} border-2 ${categoryColors[cat].border}`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority Selection */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Priority
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Low', 'Medium', 'High', 'Urgent'] as EventPriority[]).map((pri) => (
                          <button
                            key={pri}
                            onClick={() => setPriority(pri)}
                            className={`p-2 rounded-lg text-sm font-medium transition-all ${
                              priority === pri
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {pri}
                          </button>
                        ))}
                      </div>
                    </div>

                     {/* Custom Save Button */}
                     <button
                       onClick={handleSaveCustom}
                       disabled={!title.trim()}
                       className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                     >
                       💾 Save Reminder
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
