'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  CheckCircle,
  AlertCircle,
  Clock,
  List,
  Calendar,
  X
} from 'lucide-react'
import { 
  ParsedVoiceCommand, 
  createEventFromVoiceCommand,
  getVoiceSystem 
} from '@/lib/voice/voiceCommandSystem'
import { useStore } from '@/store'
import { Event } from '@/types'

interface VoiceCommandHandlerProps {
  onEventsCreated?: (events: Event[]) => void
  onTasksCreated?: (tasks: string[]) => void
}

export function VoiceCommandHandler({ 
  
  onEventsCreated, 
  onTasksCreated 
}: VoiceCommandHandlerProps) {
  const [isListening, setIsListening] = useState(false)
  const [lastCommand, setLastCommand] = useState<ParsedVoiceCommand | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceSystem] = useState(() => getVoiceSystem())
  
  const addEvent = useStore((state) => state.addEvent)
  const addTask = useStore((state) => state.addTask)

  const handleVoiceCommand = useCallback(async (command: ParsedVoiceCommand) => {
    setIsProcessing(true)
    setLastCommand(command)
    setError(null)

    try {
      // Create events if any
      if (command.events.length > 0) {
        const events = createEventFromVoiceCommand(command)
        
        // Add to store
        events.forEach(event => addEvent(event))
        
        // Notify parent component
        onEventsCreated?.(events)
      }

      // Create tasks if any
      if (command.tasks.length > 0) {
        const tasksWithMetadata = command.tasks.map(task => ({
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: task,
          completed: false,
          created_at: new Date().toISOString(),
          priority: 'Medium' as const
        }))

        // Add to store
        tasksWithMetadata.forEach(task => addTask(task))
        
        // Notify parent component
        onTasksCreated?.(command.tasks)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process voice command')
    } finally {
      setIsProcessing(false)
    }
  }, [addEvent, addTask, onEventsCreated, onTasksCreated])

  const handleError = useCallback((error: string) => {
    setError(error)
    setIsListening(false)
  }, [])

  useEffect(() => {
    voiceSystem.setCommandHandler(handleVoiceCommand)
    voiceSystem.setErrorHandler(handleError)

    return () => {
      voiceSystem.stopListening()
    }
  }, [voiceSystem, handleVoiceCommand, handleError])

  const toggleListening = () => {
    if (isListening) {
      voiceSystem.stopListening()
      setIsListening(false)
    } else {
      voiceSystem.startListening()
      setIsListening(true)
    }
  }

  const getCommandIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'task':
        return <List className="w-5 h-5 text-green-600" />
      case 'mixed':
        return <Clock className="w-5 h-5 text-purple-600" />
      default:
        return <Mic className="w-5 h-5 text-gray-600" />
    }
  }

  const getCommandTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Event'
      case 'task':
        return 'Task'
      case 'mixed':
        return 'Mixed'
      default:
        return 'Unknown'
    }
  }

  if (!voiceSystem.isSupported()) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        <div>
          <h4 className="font-medium text-red-800 dark:text-red-200">
            Voice Commands Not Supported
          </h4>
          <p className="text-sm text-red-600 dark:text-red-400">
              Your browser doesn&apos;t support speech recognition
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Voice Control */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isListening ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {isListening ? (
              <Volume2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Voice Commands
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isListening ? 'Listening for commands...' : 'Ready to listen'}
            </p>
          </div>
        </div>
        
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2 inline" />
              Stop
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2 inline" />
              Start
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">
                Voice Error
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Processing Voice Command
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Creating your reminders and events...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Command Result */}
      <AnimatePresence>
        {lastCommand && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Voice Command Processed
              </h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getCommandIcon(lastCommand.type)}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type: {getCommandTypeLabel(lastCommand.type)}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Trigger:</strong> &quot;{lastCommand.trigger}&quot;
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Input:</strong> &quot;{lastCommand.rawInput}&quot;
              </div>

              {lastCommand.events.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Created Events:
                  </h5>
                  <ul className="space-y-1">
                    {lastCommand.events.map((event, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {event.title} ({event.date.toLocaleDateString()})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lastCommand.tasks.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Created Tasks:
                  </h5>
                  <ul className="space-y-1">
                    {lastCommand.tasks.map((task, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Tips */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Voice Command Tips
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Say &quot;schedule meeting tomorrow at 2pm&quot; for events</li>
          <li>• Say &quot;remind me to buy groceries&quot; for tasks</li>
          <li>• Combine multiple commands: &quot;schedule call at 3pm and remind me to get eggs&quot;</li>
          <li>• Customize your trigger phrase in settings</li>
        </ul>
      </div>
    </div>
  )
}
