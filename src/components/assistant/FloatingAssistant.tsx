'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Settings,
  Volume2,
  VolumeX,
  Zap,
  Clock,
  Calendar,
  List,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { getEnhancedNLPSystem, AIAnalysis } from '@/lib/ai/enhancedNLPSystem'
import { getScheduleOptimizer, ScheduleAnalysis } from '@/lib/ai/scheduleOptimizer'
import { useStore } from '@/store'
import { Event } from '@/types'

interface FloatingAssistantProps {
  isVisible: boolean
  onToggle: () => void
  position: { x: number; y: number }
  onPositionChange: (position: { x: number; y: number }) => void
  brandIcon?: string
  customIcon?: string
  isProUser?: boolean
}

export function FloatingAssistant({
  isVisible,
  onToggle,
  position,
  onPositionChange,
  brandIcon,
  customIcon,
  isProUser = false
}: FloatingAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [lastResponse, setLastResponse] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [assistantSettings, setAssistantSettings] = useState({
    voiceResponses: true,
    alertSounds: true,
    autoOptimize: true,
    showNotifications: true,
    responseSpeed: 'fast' as 'fast' | 'normal' | 'detailed'
  })

  const dragRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const { events, tasks, addEvent, addTask } = useStore()
  const nlpSystem = getEnhancedNLPSystem()
  const optimizer = getScheduleOptimizer()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript
          setCurrentInput(transcript)
          handleVoiceInput(transcript)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
          setLastResponse('Sorry, I didn\'t catch that. Please try again.')
        }
      }
    }
  }, [])

  const handleDragStart = (e: React.MouseEvent) => {
    if (!dragRef.current) return
    
    isDragging.current = true
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    
    const newPosition = {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    }
    
    // Keep within screen bounds
    newPosition.x = Math.max(0, Math.min(newPosition.x, window.innerWidth - 60))
    newPosition.y = Math.max(0, Math.min(newPosition.y, window.innerHeight - 60))
    
    onPositionChange(newPosition)
  }

  const handleDragEnd = () => {
    isDragging.current = false
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }

  const handleVoiceInput = async (input: string) => {
    setIsProcessing(true)
    
    try {
      const analysis = nlpSystem.analyzeInput(input)
      
      // Handle different intents
      switch (analysis.intent) {
        case 'create_event':
          await handleCreateEvents(analysis.entities.events)
          break
        case 'create_task':
          await handleCreateTasks(analysis.entities.tasks)
          break
        case 'mixed':
          await handleCreateEvents(analysis.entities.events)
          await handleCreateTasks(analysis.entities.tasks)
          break
        case 'query_schedule':
          await handleScheduleQuery(analysis.entities.queries)
          break
        case 'optimize_schedule':
          await handleScheduleOptimization()
          break
      }
      
      // Generate response
      const response = generateResponse(analysis)
      setLastResponse(response)
      
      // Play alert sound if enabled
      if (assistantSettings.alertSounds) {
        playAlertSound()
      }
      
    } catch (error) {
      setLastResponse('Sorry, I encountered an error processing your request.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateEvents = async (eventData: AIAnalysis['entities']['events']) => {
    for (const eventInfo of eventData) {
      const event: Event = {
        id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: eventInfo.title,
        description: `Created via voice command`,
        start_date: eventInfo.date.toISOString(),
        end_date: new Date(eventInfo.date.getTime() + eventInfo.duration * 60000).toISOString(),
        is_all_day: false,
        location: eventInfo.location || '',
        category: eventInfo.category,
        priority: eventInfo.priority,
        recurrence_type: 'None',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user'
      }
      
      addEvent(event)
    }
  }

  const handleCreateTasks = async (taskData: AIAnalysis['entities']['tasks']) => {
    for (const taskInfo of taskData) {
      const task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: taskInfo.title,
        completed: false,
        created_at: new Date().toISOString(),
        priority: taskInfo.priority
      }
      
      addTask(task)
    }
  }

  const handleScheduleQuery = async (queries: AIAnalysis['entities']['queries']) => {
    const query = queries[0] // Handle first query for now
    
    switch (query.type) {
      case 'schedule_overview':
        const todayEvents = events.filter(e => isToday(new Date(e.start_date)))
        setLastResponse(`You have ${todayEvents.length} events today. ${todayEvents.map(e => e.title).join(', ')}`)
        break
        
      case 'next_event':
        const nextEvent = events
          .filter(e => new Date(e.start_date) > new Date())
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
        if (nextEvent) {
          setLastResponse(`Your next event is "${nextEvent.title}" at ${formatTime(new Date(nextEvent.start_date))}`)
        } else {
          setLastResponse('You have no upcoming events.')
        }
        break
        
      case 'category_filter':
        const courtEvents = events.filter(e => e.category === 'Court')
        if (courtEvents.length > 0) {
          const nextCourtEvent = courtEvents
            .filter(e => new Date(e.start_date) > new Date())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
          if (nextCourtEvent) {
            setLastResponse(`Your next court date is "${nextCourtEvent.title}" on ${formatDate(new Date(nextCourtEvent.start_date))}`)
          } else {
            setLastResponse('You have no upcoming court dates.')
          }
        } else {
          setLastResponse('You have no court dates scheduled.')
        }
        break
    }
  }

  const handleScheduleOptimization = async () => {
    const analysis = optimizer.analyzeSchedule(events)
    
    if (analysis.optimizations.length > 0) {
      const criticalIssues = analysis.optimizations.filter(o => o.impact === 'critical').length
      const highIssues = analysis.optimizations.filter(o => o.impact === 'high').length
      
      let response = `I found ${analysis.optimizations.length} optimization opportunities. `
      if (criticalIssues > 0) {
        response += `${criticalIssues} critical issues need immediate attention. `
      }
      if (highIssues > 0) {
        response += `${highIssues} high-impact issues should be addressed. `
      }
      response += `Your schedule score is ${analysis.overallScore}/100.`
      
      setLastResponse(response)
      
      // Play alert sound for optimization alerts
      if (assistantSettings.alertSounds && (criticalIssues > 0 || highIssues > 0)) {
        playAlertSound()
      }
    } else {
      setLastResponse('Your schedule is well optimized! No issues found.')
    }
  }

  const generateResponse = (analysis: AIAnalysis): string => {
    switch (analysis.intent) {
      case 'create_event':
        if (analysis.entities.events.length > 0) {
          return `I've created ${analysis.entities.events.length} event(s) for you.`
        }
        break
        
      case 'create_task':
        if (analysis.entities.tasks.length > 0) {
          return `I've added ${analysis.entities.tasks.length} task(s) to your list.`
        }
        break
        
      case 'mixed':
        const eventCount = analysis.entities.events.length
        const taskCount = analysis.entities.tasks.length
        return `I've created ${eventCount} event(s) and added ${taskCount} task(s) for you.`
        
      case 'query_schedule':
        return 'Here\'s what I found in your schedule.'
        
      case 'optimize_schedule':
        return 'I\'ve analyzed your schedule for optimization opportunities.'
    }
    
    return 'I\'m here to help! What would you like to do?'
  }

  const playAlertSound = () => {
    // Create and play a subtle alert sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  // Helper functions
  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString()
  }

  if (!isVisible) return null

  return (
    <>
      {/* Floating Assistant Button */}
      <motion.div
        ref={dragRef}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="fixed z-50 cursor-move"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleDragStart}
      >
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              isExpanded 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } text-white flex items-center justify-center`}
            title="RE:MIND Assistant"
          >
            {customIcon ? (
              <img src={customIcon} alt="Assistant" className="w-8 h-8 rounded-full" />
            ) : brandIcon ? (
              <img src={brandIcon} alt="RE:MIND" className="w-8 h-8 rounded-full" />
            ) : (
              <Zap className="w-7 h-7" />
            )}
          </button>

          {/* Status Indicators */}
          {isListening && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
          {isProcessing && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-spin" />
          )}
          {lastResponse && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full" />
          )}
        </div>
      </motion.div>

      {/* Expanded Assistant Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: position.x - 200, y: position.y - 300 }}
            animate={{ opacity: 1, scale: 1, x: position.x - 200, y: position.y - 300 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-40 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {customIcon ? (
                    <img src={customIcon} alt="Assistant" className="w-6 h-6 rounded-full" />
                  ) : (
                    <Zap className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    RE:MIND Assistant
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Always ready to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Voice Input Display */}
              {currentInput && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>You said:</strong> {currentInput}
                  </p>
                </div>
              )}

              {/* Response Display */}
              {lastResponse && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Assistant:</strong> {lastResponse}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVoiceInput('What\'s my schedule today?')}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Today's Schedule</span>
                </button>
                
                <button
                  onClick={() => handleVoiceInput('What\'s coming up next?')}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">What's Next</span>
                </button>
                
                <button
                  onClick={() => handleVoiceInput('Optimize my schedule')}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Optimize</span>
                </button>
                
                <button
                  onClick={() => handleVoiceInput('Show my tasks')}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm">My Tasks</span>
                </button>
              </div>

              {/* Voice Control */}
              <div className="flex items-center justify-center">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Listening
                    </>
                  )}
                </button>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">Assistant Settings</h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Voice Responses</span>
                      <input
                        type="checkbox"
                        checked={assistantSettings.voiceResponses}
                        onChange={(e) => setAssistantSettings(prev => ({ ...prev, voiceResponses: e.target.checked }))}
                        className="rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Alert Sounds</span>
                      <input
                        type="checkbox"
                        checked={assistantSettings.alertSounds}
                        onChange={(e) => setAssistantSettings(prev => ({ ...prev, alertSounds: e.target.checked }))}
                        className="rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Auto Optimize</span>
                      <input
                        type="checkbox"
                        checked={assistantSettings.autoOptimize}
                        onChange={(e) => setAssistantSettings(prev => ({ ...prev, autoOptimize: e.target.checked }))}
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
