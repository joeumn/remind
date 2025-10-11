'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Clock, 
  Calendar, 
  MapPin, 
  Tag, 
  Mic, 
  MicOff,
  Send,
  X,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useStore } from '@/store'
import { Event, EventCategory, EventPriority } from '@/types'
import { generateEventId } from '@/utils/idGenerator'
import { getEnhancedNLPSystem } from '@/lib/ai/enhancedNLPSystem'

interface InstantCaptureProps {
  isOpen: boolean
  onClose: () => void
  initialText?: string
  quickMode?: boolean
}

export function InstantCapture({ isOpen, onClose, initialText = '', quickMode = false }: InstantCaptureProps) {
  const [inputText, setInputText] = useState(initialText)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [capturedEvent, setCapturedEvent] = useState<Partial<Event> | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  
  const { addEvent } = useStore()
  const nlpSystem = getEnhancedNLPSystem()

  // Auto-focus and process initial text
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      if (initialText) {
        processInput(initialText)
      }
    } else {
      setInputText('')
      setCapturedEvent(null)
      setIsSuccess(false)
    }
  }, [isOpen, initialText])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        setInputText(transcript)
        processInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const processInput = async (text: string) => {
    if (!text.trim()) return

    setIsProcessing(true)
    
    try {
      const analysis = nlpSystem.analyzeInput(text)
      
      if (analysis.entities.events.length > 0) {
        const eventData = analysis.entities.events[0]
        const event: Partial<Event> = {
          id: generateEventId(),
          title: eventData.title,
          description: `Created via instant capture: "${text}"`,
          start_date: eventData.date.toISOString(),
          end_date: new Date(eventData.date.getTime() + eventData.duration * 60000).toISOString(),
          is_all_day: false,
          location: eventData.location || '',
          category: eventData.category,
          priority: eventData.priority,
          reminder_settings: {
            enabled: true,
            reminders: [
              { value: 15, unit: 'minutes' },
              { value: 1, unit: 'hours' }
            ]
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'current-user'
        }
        setCapturedEvent(event)
      } else {
        // Create a task if no event detected
        const event: Partial<Event> = {
          id: generateEventId(),
          title: text,
          description: `Task created via instant capture`,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          is_all_day: true,
          category: 'Personal',
          priority: 'Medium',
          reminder_settings: {
            enabled: true,
            reminders: [
              { value: 1, unit: 'hours' }
            ]
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'current-user'
        }
        setCapturedEvent(event)
      }
    } catch (error) {
      console.error('Error processing input:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = async () => {
    if (!capturedEvent) return

    try {
      addEvent(capturedEvent as Event)
      setIsSuccess(true)
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleVoiceCapture = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    }
  }

  const quickTemplates = [
    { text: 'Call doctor tomorrow at 2pm', icon: '📞' },
    { text: 'Pick up groceries today', icon: '🛒' },
    { text: 'Meeting with team next Monday', icon: '👥' },
    { text: 'Submit report by Friday', icon: '📄' },
    { text: 'Gym workout at 6pm', icon: '💪' }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Instant Capture
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Never forget anything again
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Close capture"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Main Input */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value)
                    processInput(e.target.value)
                  }}
                  placeholder="Say or type what you need to remember..."
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  title="Type or speak your reminder"
                />
                <button
                  onClick={handleVoiceCapture}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              {/* Status Indicators */}
              {isProcessing && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  <span className="text-sm">Processing your reminder...</span>
                </div>
              )}

              {isListening && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <div className="animate-pulse rounded-full h-4 w-4 bg-red-600" />
                  <span className="text-sm">Listening... Speak now</span>
                </div>
              )}
            </div>

            {/* Quick Templates */}
            {!inputText && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quick Templates
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {quickTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(template.text)
                        processInput(template.text)
                      }}
                      className="flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">{template.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">{template.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Captured Event Preview */}
            {capturedEvent && !isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-medium text-green-800 dark:text-green-200">
                    Ready to Save
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">
                      <strong>Title:</strong> {capturedEvent.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">
                      <strong>When:</strong> {new Date(capturedEvent.start_date!).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">
                      <strong>Category:</strong> {capturedEvent.category}
                    </span>
                  </div>
                  
                  {capturedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">
                        <strong>Where:</strong> {capturedEvent.location}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                  >
                    {showAdvanced ? 'Hide' : 'Edit'} Details
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Save Reminder
                  </button>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Reminder Saved!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You'll never forget this again. We'll remind you!
                </p>
              </motion.div>
            )}

            {/* Advanced Editing */}
            {showAdvanced && capturedEvent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Edit Details
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={capturedEvent.category}
                      onChange={(e) => setCapturedEvent(prev => prev ? { ...prev, category: e.target.value as EventCategory } : null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Work">Work</option>
                      <option value="Court">Court</option>
                      <option value="Family">Family</option>
                      <option value="Personal">Personal</option>
                      <option value="Recovery">Recovery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={capturedEvent.priority}
                      onChange={(e) => setCapturedEvent(prev => prev ? { ...prev, priority: e.target.value as EventPriority } : null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
