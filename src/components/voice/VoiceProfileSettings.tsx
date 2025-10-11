'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Plus, 
  Trash2, 
  Play, 
  Square,
  Save,
  X,
  Volume2,
  VolumeX
} from 'lucide-react'
import { VoiceProfile, VoiceTrigger, getVoiceSystem } from '@/lib/voice/voiceCommandSystem'

interface VoiceProfileSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceProfileSettings({ isOpen, onClose }: VoiceProfileSettingsProps) {
  const [profile, setProfile] = useState<VoiceProfile>(() => getVoiceSystem().getProfile())
  const [newTrigger, setNewTrigger] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceSystem] = useState(() => getVoiceSystem())

  useEffect(() => {
    if (isOpen) {
      setProfile(voiceSystem.getProfile())
    }
  }, [isOpen, voiceSystem])

  const handleSave = () => {
    voiceSystem.updateProfile(profile)
    // Here you would typically save to user profile/database
    onClose()
  }

  const handleAddTrigger = () => {
    if (!newTrigger.trim()) return

    const trigger: VoiceTrigger = {
      id: `custom-${Date.now()}`,
      name: newTrigger,
      command: newTrigger.toLowerCase(),
      isActive: true,
      type: 'single'
    }

    setProfile(prev => ({
      ...prev,
      triggers: [...prev.triggers, trigger]
    }))
    setNewTrigger('')
  }

  const handleRemoveTrigger = (triggerId: string) => {
    setProfile(prev => ({
      ...prev,
      triggers: prev.triggers.filter(t => t.id !== triggerId)
    }))
  }

  const handleToggleTrigger = (triggerId: string) => {
    setProfile(prev => ({
      ...prev,
      triggers: prev.triggers.map(t => 
        t.id === triggerId ? { ...t, isActive: !t.isActive } : t
      )
    }))
  }

  const handleTestTrigger = async (_trigger: VoiceTrigger) => {
    setIsListening(true)
    try {
      // Test the trigger
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate listening
    } finally {
      setIsListening(false)
    }
  }

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Voice Commands
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your voice triggers and settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Close voice settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Voice Status */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
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
                      Voice Recognition
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {voiceSystem.isSupported() ? 'Ready to listen' : 'Not supported in this browser'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (isListening) {
                      voiceSystem.stopListening()
                      setIsListening(false)
                    } else {
                      voiceSystem.startListening()
                      setIsListening(true)
                    }
                  }}
                  disabled={!voiceSystem.isSupported()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isListening ? (
                    <>
                      <Square className="w-4 h-4 mr-2 inline" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2 inline" />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 space-y-6">
              {/* Continuous Listening */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Continuous Listening
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep listening for voice commands in the background
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isContinuousListening}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      isContinuousListening: e.target.checked 
                    }))}
                    className="sr-only peer"
                    title="Enable continuous listening mode"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Auto Create */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Auto Create
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically create reminders and events from voice commands
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.autoCreate}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      autoCreate: e.target.checked 
                    }))}
                    className="sr-only peer"
                    title="Automatically create reminders from voice commands"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Sensitivity */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Sensitivity: {Math.round(profile.sensitivity * 100)}%
                </h4>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={profile.sensitivity}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    sensitivity: parseFloat(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  title="Adjust voice command sensitivity"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Higher values make the system more sensitive to voice commands
                </p>
              </div>

              {/* Voice Triggers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Voice Triggers
                  </h4>
                  <button
                    onClick={handleAddTrigger}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Trigger
                  </button>
                </div>

                {/* Add New Trigger */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      placeholder="Enter your custom trigger (e.g., 'hey wanda')"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Enter custom voice trigger"
                    />
                    <button
                      onClick={handleAddTrigger}
                      disabled={!newTrigger.trim()}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Trigger List */}
                <div className="space-y-3">
                  {profile.triggers.map((trigger) => (
                    <motion.div
                      key={trigger.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${trigger.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {trigger.name}
                          </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          &quot;{trigger.command}&quot; • {trigger.type}
                        </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestTrigger(trigger)}
                          disabled={!trigger.isActive}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Test trigger"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleTrigger(trigger.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={trigger.isActive ? 'Disable trigger' : 'Enable trigger'}
                        >
                          {trigger.isActive ? (
                            <Mic className="w-4 h-4 text-green-600" />
                          ) : (
                            <MicOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        {trigger.id.startsWith('custom-') && (
                          <button
                            onClick={() => handleRemoveTrigger(trigger.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded-lg transition-colors"
                            title="Remove trigger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
