'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Zap, 
  Shield,
  Mic,
  Play,
  X,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react'

interface VolumeButtonCampaignProps {
  isOpen: boolean
  onClose: () => void
}

export function VolumeButtonCampaign({ isOpen, onClose }: VolumeButtonCampaignProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      title: "Revolutionary Feature",
      subtitle: "The ONLY app with volume button capture",
      content: "Never seen before in any reminder app",
      icon: Award,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Works Everywhere",
      subtitle: "Even when your phone is locked",
      content: "In your pocket, while driving, anywhere!",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Instant Activation",
      subtitle: "Just press volume up or down",
      content: "No need to unlock or open the app",
      icon: Zap,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Bulletproof Reliability",
      subtitle: "Never miss another reminder",
      content: "Multiple notification channels ensure delivery",
      icon: Shield,
      color: "from-orange-500 to-red-600"
    }
  ]

  const features = [
    {
      icon: Volume2,
      title: "UP → DOWN Sequence",
      description: "Press UP then DOWN quickly to instantly start voice capture",
      highlight: "WORLD'S FIRST"
    },
    {
      icon: Smartphone,
      title: "Works When Locked",
      description: "Create reminders without unlocking your phone",
      highlight: "UNIQUE"
    },
    {
      icon: Shield,
      title: "Bulletproof Notifications",
      description: "Multiple delivery channels ensure you never miss anything",
      highlight: "RELIABLE"
    },
    {
      icon: Zap,
      title: "3-Second Capture",
      description: "From thought to reminder in just 3 seconds",
      highlight: "FASTEST"
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Busy Professional",
      content: "This volume button feature is a game changer! I can set reminders while driving without taking my eyes off the road.",
      rating: 5
    },
    {
      name: "Mike R.",
      role: "Entrepreneur",
      content: "Finally, an app that actually works when I need it. The volume button capture is genius - works even when my phone is in my pocket!",
      rating: 5
    },
    {
      name: "Lisa K.",
      role: "Mom of 3",
      content: "I never miss appointments anymore. Just press volume up, say what I need to remember, and RE:MIND handles everything else.",
      rating: 5
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlayDemo = () => {
    setIsPlaying(true)
    // Simulate demo playback
    setTimeout(() => {
      setIsPlaying(false)
    }, 5000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                <span>WORLD'S FIRST UP → DOWN SEQUENCE</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                If Something's UP or Going DOWN
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Hit UP then DOWN - the ONLY reminder app with this revolutionary gesture!
              </p>
              <button
                onClick={handlePlayDemo}
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent" />
                    Playing Demo...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Revolutionary UP → DOWN Sequence
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  RE:MIND is the first and only app that uses the UP → DOWN sequence for voice capture. 
                  Never interferes with normal volume control - works even when your phone is locked!
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                    <Volume2 className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold">Volume Buttons</div>
                    <div className="text-sm opacity-90">Hardware Integration</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                    <Shield className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold">Always Works</div>
                    <div className="text-sm opacity-90">Even When Locked</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
                    <Zap className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold">Instant</div>
                    <div className="text-sm opacity-90">3-Second Capture</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg">
                    <Smartphone className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold">Universal</div>
                    <div className="text-sm opacity-90">All Devices</div>
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  Why This Changes Everything
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {feature.title}
                            </h4>
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                              {feature.highlight}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      Press Volume Button
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Press and hold volume up or down anywhere, anytime
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      Speak Your Reminder
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Say what you need to remember in natural language
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      Never Forget Again
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI processes and creates bulletproof reminders
                    </p>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  Perfect For Every Situation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "🚗 While driving - hands-free operation",
                    "🏃 While exercising - no need to stop",
                    "🍳 While cooking - voice commands work",
                    "📱 Phone in pocket - works through fabric",
                    "🔒 Phone locked - no need to unlock",
                    "💼 In meetings - silent and discrete",
                    "🛏️ In bed - no need to reach for phone",
                    "🚿 In shower - waterproof cases work",
                    "🎧 With headphones - voice still works"
                  ].map((useCase, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 font-medium">
                        {useCase}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  What Users Are Saying
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Be the First to Experience This Revolution
                </h3>
                <p className="text-lg opacity-90 mb-6">
                  Join thousands of users who never miss anything again
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Try Volume Capture Now
                  </button>
                  <button className="px-8 py-4 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800 transition-colors flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" />
                    Share with Friends
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
