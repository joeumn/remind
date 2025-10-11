'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Settings,
  Zap,
  Smartphone,
  Shield,
  Volume1,
  Volume2 as VolumeUp,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { getVolumeCapture } from '@/lib/hardware/volumeButtonCapture'

interface VolumeCaptureSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function VolumeCaptureSettings({ isOpen, onClose }: VolumeCaptureSettingsProps) {
  const [config, setConfig] = useState({
    enabled: true,
    sequenceTimeout: 800,
    vibrateOnActivation: true,
    playSoundOnActivation: true,
    playActivationJingle: true
  })

  const [isListening, setIsListening] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [demoMessage, setDemoMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      const volumeCapture = getVolumeCapture()
      const status = volumeCapture.getStatus()
      setConfig(status.config)
      setIsListening(status.isListening)

      // Subscribe to status updates
      const interval = setInterval(() => {
        const currentStatus = volumeCapture.getStatus()
        setIsListening(currentStatus.isListening)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    
    const volumeCapture = getVolumeCapture()
    volumeCapture.updateConfig({ [key]: value })
  }

  const handleDemo = () => {
    setShowDemo(true)
    setDemoMessage('Quickly press VOLUME UP then VOLUME DOWN to start voice capture...')
    
    setTimeout(() => {
      setDemoMessage('Demo completed! Try the UP → DOWN sequence yourself.')
      setTimeout(() => {
        setShowDemo(false)
        setDemoMessage('')
      }, 2000)
    }, 3000)
  }

  if (!isOpen) return null

  return (
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                UP → DOWN Capture
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Revolutionary voice capture using UP → DOWN sequence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            {/* Feature Introduction */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                  Game-Changing Feature
                </h3>
              </div>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                RE:MIND is the ONLY app that uses the UP → DOWN sequence for voice capture. 
                Never interferes with normal volume control - works even when your phone is locked!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Works when locked</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Hands-free operation</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Instant activation</span>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                {isListening ? (
                  <Mic className="w-5 h-5 text-green-500 animate-pulse" />
                ) : config.enabled ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      UP → DOWN Capture
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isListening ? 'Listening for voice input...' : 
                       config.enabled ? 'Ready for UP → DOWN sequence' : 'Disabled'}
                    </p>
                  </div>
              </div>
              <button
                onClick={() => handleConfigChange('enabled', !config.enabled)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  config.enabled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {config.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Sequence Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                UP → DOWN Sequence
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <VolumeUp className="w-5 h-5 text-blue-500" />
                  <span className="text-lg font-bold">UP</span>
                  <span className="text-gray-400">→</span>
                  <Volume1 className="w-5 h-5 text-orange-500" />
                  <span className="text-lg font-bold">DOWN</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Quickly press volume UP then volume DOWN to activate voice capture. 
                  Never interferes with normal volume control!
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Sequence Timeout
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Time allowed between UP and DOWN presses
                    </p>
                  </div>
                  <select
                    value={config.sequenceTimeout}
                    onChange={(e) => handleConfigChange('sequenceTimeout', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    title="Sequence timeout setting"
                  >
                    <option value={500}>500ms (Very Fast)</option>
                    <option value={800}>800ms (Fast)</option>
                    <option value={1000}>1000ms (Normal)</option>
                    <option value={1500}>1500ms (Slow)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feedback Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Feedback Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Vibration Feedback
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vibrate when voice capture starts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.vibrateOnActivation}
                    onChange={(e) => handleConfigChange('vibrateOnActivation', e.target.checked)}
                    className="toggle toggle-primary"
                    title="Enable vibration feedback"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Sound Feedback
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play sound when voice capture starts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.playSoundOnActivation}
                    onChange={(e) => handleConfigChange('playSoundOnActivation', e.target.checked)}
                    className="toggle toggle-primary"
                    title="Enable sound feedback"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Activation Jingle
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play UP → DOWN melody when sequence is detected
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.playActivationJingle}
                    onChange={(e) => handleConfigChange('playActivationJingle', e.target.checked)}
                    className="toggle toggle-primary"
                    title="Enable activation jingle"
                  />
                </div>
              </div>
            </div>

            {/* Demo Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Try It Now
                </h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Test the UP → DOWN sequence feature. Quickly press volume UP then volume DOWN, 
                then speak your reminder.
              </p>
              <button
                onClick={handleDemo}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Start Demo
              </button>
            </div>

            {/* Usage Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Usage Examples
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    📞 Phone Call
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Call mom tomorrow at 3pm"
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    🛒 Shopping
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Pick up groceries tonight"
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    🏥 Appointment
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Doctor appointment next Monday at 2pm"
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    💼 Meeting
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Team meeting Friday morning at 9am"
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Message */}
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="animate-pulse rounded-full h-3 w-3 bg-green-500" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    {demoMessage}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Technical Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-gray-500" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Technical Information
                </h4>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Works on all modern browsers with speech recognition support</p>
                <p>• Requires microphone permissions</p>
                <p>• Best experience on mobile devices</p>
                <p>• Background operation requires PWA installation</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
