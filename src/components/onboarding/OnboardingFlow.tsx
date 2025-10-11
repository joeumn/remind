'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Smartphone, 
  Globe, 
  Share2, 
  ArrowRight, 
  Check,
  Sparkles,
  Mic,
  Calendar,
  Shield
} from 'lucide-react'

interface OnboardingFlowProps {
  isOpen: boolean
  onComplete: () => void
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to RE:MIND',
    subtitle: 'The fastest, simplest reminder app ever built',
    icon: Sparkles,
    content: (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Never Miss Anything Again
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          RE:MIND is designed to be so fast and simple that creating reminders becomes effortless.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lightning Fast</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Any Device</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'voice',
    title: 'Just Speak Your Mind',
    subtitle: 'Natural language processing understands everything',
    icon: Mic,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Voice-First Design
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Talk naturally and RE:MIND understands
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">&quot;Call mom tomorrow at 3pm&quot;</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">&quot;Meeting with team next Monday&quot;</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">&quot;Pick up groceries in 30 minutes&quot;</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'universal',
    title: 'Works Everywhere',
    subtitle: 'Same experience on any device, anywhere',
    icon: Globe,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
            <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Mobile</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">iOS & Android</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
            <Globe className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Web</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Any Browser</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Desktop</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Windows, Mac, Linux</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
            <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">PWA</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Install Anywhere</p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ✨ Instant Sync
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Create a reminder on your phone, see it on your computer. It&apos;s that simple.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'share',
    title: 'Share the Magic',
    subtitle: 'Help others discover the simplicity',
    icon: Share2,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Spread the Word
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Help your friends and family never miss important moments
          </p>
        </div>
        
        <div className="space-y-4">
          <button className="w-full flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">📱</span>
            </div>
            <div className="text-left">
              <p className="font-semibold">Share with Friends</p>
              <p className="text-sm text-blue-100">Send them a link to try RE:MIND</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto" />
          </button>
          
          <button className="w-full flex items-center gap-3 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">🎁</span>
            </div>
            <div className="text-left">
              <p className="font-semibold">Get Rewards</p>
              <p className="text-sm text-green-100">Earn credits for each referral</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto" />
          </button>
        </div>
      </div>
    )
  }
]

export function OnboardingFlow({ isOpen, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentStepData = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">RE:MIND</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 space-y-4">
          {/* Step Indicators */}
          <div className="flex justify-center gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
            >
              {isLastStep ? (
                <>
                  <Check className="w-5 h-5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Step Counter */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
