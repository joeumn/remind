'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Zap, Clock, Sparkles, Users, Trophy, ArrowRight, Play } from 'lucide-react'

interface BoothProps {
  onClose: () => void
  onTryDemo: () => void
}

const demoSteps = [
  {
    id: 1,
    title: "Voice Input",
    description: "Just speak your reminder",
    icon: <Mic className="w-8 h-8" />,
    example: "Call mom tomorrow at 3pm"
  },
  {
    id: 2,
    title: "Natural Language",
    description: "Type like you talk",
    icon: <Zap className="w-8 h-8" />,
    example: "Meeting in 2 hours"
  },
  {
    id: 3,
    title: "Quick Templates",
    description: "One-tap scheduling",
    icon: <Clock className="w-8 h-8" />,
    example: "30 min • 1 hour • Tomorrow 9am"
  }
]

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "3-Second Setup",
    description: "Fastest reminder creation ever"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Universal Access",
    description: "Works for everyone, any age"
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "AI-Powered",
    description: "Smart scheduling suggestions"
  }
]

export function Booth({ onClose, onTryDemo }: BoothProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayDemo = () => {
    setIsPlaying(true)
    // Simulate demo progression
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 2000)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">RE:MIND</h1>
                  <p className="text-xl text-blue-100">The Elite Reminder App</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-lg text-blue-100 max-w-2xl">
                Experience the fastest, most intelligent reminder system designed for professionals who demand absolute reliability.
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Demo Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Interactive Demo</h2>
                <button
                  onClick={handlePlayDemo}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  {isPlaying ? 'Playing...' : 'Try Demo'}
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ 
                      opacity: currentStep === index ? 1 : 0.5,
                      scale: currentStep === index ? 1 : 0.9
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      currentStep === index
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-xl ${
                        currentStep === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border">
                      <p className="text-sm text-gray-700 italic">"{step.example}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why RE:MIND?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-600 text-white rounded-lg">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Professionals Say</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <p className="text-gray-700 mb-4 italic">
                    "I haven't missed a court date in 6 months since switching to RE:MIND. The multi-layer reminders give me complete peace of mind."
                  </p>
                  <p className="font-semibold text-gray-900">- Sarah M., Trial Attorney</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-200">
                  <p className="text-gray-700 mb-4 italic">
                    "The voice input is a game-changer while driving. I can add reminders without taking my hands off the wheel."
                  </p>
                  <p className="font-semibold text-gray-900">- Michael R., Sales Executive</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onTryDemo}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Try RE:MIND Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
