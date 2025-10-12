'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Zap } from 'lucide-react'

interface AdBlockerProps {
  isProUser: boolean
  children: React.ReactNode
}

interface AdPlacementProps {
  isProUser: boolean
  className?: string
}

// Mock ad component that shows for free users
function MockAd({ isProUser, className = '' }: AdPlacementProps) {
  const [isVisible, setIsVisible] = useState(!isProUser)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    setIsVisible(!isProUser && !isDismissed)
  }, [isProUser, isDismissed])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 ${className}`}
      >
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Dismiss ad"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
        
        <div className="pr-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Upgrade to Pro
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Remove all ads and unlock premium features
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Zero ads - Clean, distraction-free experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span>Advanced AI features and unlimited voice commands</span>
            </div>
          </div>
          
          <button className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
            Upgrade Now - $9.99/month
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Main ad blocker component
export function AdBlocker({ isProUser, children }: AdBlockerProps) {
  return (
    <div className="relative">
      {children}
      
      {/* Show upgrade prompts for free users */}
      {!isProUser && (
        <>
          {/* Top banner ad */}
          <MockAd 
            isProUser={isProUser} 
            className="mb-4" 
          />
          
          {/* Sidebar ad */}
          <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-64">
            <MockAd 
              isProUser={isProUser} 
              className="shadow-lg" 
            />
          </div>
        </>
      )}
    </div>
  )
}

// Ad placement component for different locations
export function AdPlacement({ 
  isProUser, 
  className = '',
  placement = 'banner'
}: AdPlacementProps & { placement?: 'banner' | 'sidebar' | 'inline' | 'popup' }) {
  
  if (isProUser) {
    return null // No ads for Pro users
  }

  const adContent = {
    banner: {
      title: "🚀 Upgrade to Pro",
      subtitle: "Remove ads and unlock premium features",
      features: ["Zero ads", "Advanced AI", "Unlimited voice commands"]
    },
    sidebar: {
      title: "👑 Pro Features",
      subtitle: "Get the full RE:MIND experience",
      features: ["No interruptions", "Premium support", "Custom themes"]
    },
    inline: {
      title: "⚡ Never Miss Anything",
      subtitle: "Pro users get bulletproof reminders",
      features: ["Multi-channel alerts", "Smart scheduling", "Priority support"]
    },
    popup: {
      title: "🎯 Perfect Your Productivity",
      subtitle: "Join thousands of Pro users",
      features: ["Advanced analytics", "Team collaboration", "API access"]
    }
  }

  const content = adContent[placement]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 ${className}`}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-blue-800 dark:text-blue-200">
            {content.title}
          </h3>
        </div>
        
        <p className="text-blue-600 dark:text-blue-400 mb-4">
          {content.subtitle}
        </p>
        
        <div className="space-y-2 mb-4">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
          Upgrade to Pro - $9.99/month
        </button>
        
        <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
          Cancel anytime • 30-day free trial
        </p>
      </div>
    </motion.div>
  )
}

// Hook to check if user should see ads
export function useAdFree() {
  const [isProUser, setIsProUser] = useState(false)
  
  useEffect(() => {
    // Check user's Pro status from localStorage or API
    const proStatus = localStorage.getItem('user_pro_status')
    setIsProUser(proStatus === 'true')
  }, [])
  
  return {
    isProUser,
    showAds: !isProUser,
    upgradeToPro: () => {
      // Redirect to upgrade page
      window.location.href = '/upgrade'
    }
  }
}
