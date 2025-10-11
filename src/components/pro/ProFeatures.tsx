'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Palette, 
  Volume2, 
  Image, 
  Download,
  X,
  Check,
  Star,
  Gift,
  Shield
} from 'lucide-react'

interface ProFeaturesProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: 'free' | 'pro' | 'enterprise'
}

export function ProFeatures({ isOpen, onClose, currentPlan = 'free' }: ProFeaturesProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro')
  const [customizationOptions, setCustomizationOptions] = useState({
    customIcon: false,
    customColors: false,
    advancedVoiceSettings: false,
    unlimitedTriggers: false,
    prioritySupport: false,
    analyticsDashboard: false,
    teamCollaboration: false,
    apiAccess: false
  })

  const proFeatures = [
    {
      category: 'Floating Assistant',
      features: [
        {
          name: 'Custom Assistant Icon',
          description: 'Upload your own icon or use premium designs',
          icon: Image,
          pro: true
        },
        {
          name: 'Advanced Voice Settings',
          description: 'Custom voice models, languages, and response styles',
          icon: Volume2,
          pro: true
        },
        {
          name: 'Unlimited Voice Triggers',
          description: 'Create unlimited custom voice commands',
          icon: Zap,
          pro: true
        },
        {
          name: 'Custom Assistant Colors',
          description: 'Personalize your assistant with custom color schemes',
          icon: Palette,
          pro: true
        }
      ]
    },
    {
      category: 'AI & Optimization',
      features: [
        {
          name: 'Advanced AI Insights',
          description: 'Detailed productivity analytics and recommendations',
          icon: Sparkles,
          pro: true
        },
        {
          name: 'Smart Schedule Optimization',
          description: 'AI-powered schedule optimization with real-time alerts',
          icon: Zap,
          pro: true
        },
        {
          name: 'Predictive Scheduling',
          description: 'AI predicts optimal times for your activities',
          icon: Star,
          pro: true
        },
        {
          name: 'Energy Level Optimization',
          description: 'Schedule events based on your energy patterns',
          icon: Shield,
          pro: true
        }
      ]
    },
    {
      category: 'Customization & Branding',
      features: [
        {
          name: 'Custom Themes',
          description: 'Advanced theme customization with custom colors',
          icon: Palette,
          pro: true
        },
        {
          name: 'Brand Integration',
          description: 'Add your company logo and branding',
          icon: Image,
          pro: true
        },
        {
          name: 'Custom Notifications',
          description: 'Personalized notification sounds and styles',
          icon: Volume2,
          pro: true
        },
        {
          name: 'Export & Backup',
          description: 'Advanced export options and automatic backups',
          icon: Download,
          pro: true
        }
      ]
    },
    {
      category: 'Enterprise Features',
      features: [
        {
          name: 'Team Collaboration',
          description: 'Share calendars and collaborate with your team',
          icon: Shield,
          enterprise: true
        },
        {
          name: 'API Access',
          description: 'Integrate RE:MIND with your existing tools',
          icon: Zap,
          enterprise: true
        },
        {
          name: 'Priority Support',
          description: '24/7 priority support with dedicated account manager',
          icon: Star,
          enterprise: true
        },
        {
          name: 'Advanced Analytics',
          description: 'Team productivity analytics and insights dashboard',
          icon: Sparkles,
          enterprise: true
        }
      ]
    }
  ]

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for personal use',
      features: [
        'Basic voice commands',
        '3 custom triggers',
        'Standard themes',
        'Basic optimization',
        'Community support'
      ],
      limitations: [
        'Limited to 3 voice triggers',
        'Basic theme options only',
        'Standard notification sounds',
        'No custom icons'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      description: 'For power users and professionals',
      features: [
        'Unlimited voice triggers',
        'Custom assistant icon',
        'Advanced voice settings',
        'Custom themes & colors',
        'Smart optimization alerts',
        'Predictive scheduling',
        'Priority support',
        'Export & backup'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$29.99',
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'Custom deployment'
      ]
    }
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  RE:MIND Pro Features
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unlock the full potential of your productivity assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Close Pro Features"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Current Plan Status */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Current Plan: {plans.find(p => p.id === currentPlan)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPlan === 'free' ? 'Upgrade to unlock premium features' : 'You have access to all Pro features'}
                  </p>
                </div>
                {currentPlan === 'free' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                    <Gift className="w-4 h-4" />
                    <span className="font-medium">Upgrade Now</span>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Categories */}
            <div className="p-6 space-y-8">
              {proFeatures.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {category.category}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.features.map((feature, featureIndex) => {
                      const Icon = feature.icon
                      const isProFeature = feature.pro && currentPlan === 'free'
                      const isEnterpriseFeature = feature.enterprise && currentPlan !== 'enterprise'
                      
                      return (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className={`p-4 rounded-lg border transition-all ${
                            isProFeature || isEnterpriseFeature
                              ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                              : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              isProFeature || isEnterpriseFeature
                                ? 'bg-gray-200 dark:bg-gray-700'
                                : 'bg-green-100 dark:bg-green-900'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                isProFeature || isEnterpriseFeature
                                  ? 'text-gray-600 dark:text-gray-400'
                                  : 'text-green-600 dark:text-green-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {feature.name}
                                </h4>
                                {isProFeature && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                                    PRO
                                  </span>
                                )}
                                {isEnterpriseFeature && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full">
                                    ENTERPRISE
                                  </span>
                                )}
                                {!isProFeature && !isEnterpriseFeature && (
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Plans */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Choose Your Plan
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const isCurrentPlan = plan.id === currentPlan
                  const isSelected = plan.id === selectedPlan
                  
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: plans.indexOf(plan) * 0.1 }}
                      className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => setSelectedPlan(plan.id as 'pro' | 'enterprise')}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      {isCurrentPlan && (
                        <div className="absolute -top-3 right-4">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Current Plan
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {plan.name}
                        </h4>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            /{plan.period}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {plan.description}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.limitations && (
                        <div className="mb-6">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Limitations:
                          </h5>
                          <ul className="space-y-1">
                            {plan.limitations.map((limitation, index) => (
                              <li key={index} className="text-xs text-gray-500 dark:text-gray-400">
                                • {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        disabled={isCurrentPlan}
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                          isCurrentPlan
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              All plans include 30-day money-back guarantee
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Maybe Later
              </button>
              <button
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-lg transition-all font-medium"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
