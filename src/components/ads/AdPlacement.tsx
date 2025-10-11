'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdPlacementProps {
  type: 'banner' | 'card' | 'modal' | 'sidebar'
  placement: string
  className?: string
}

interface AdData {
  id: string
  title: string
  description: string
  image?: string
  cta: string
  url: string
  sponsor?: string
  category: 'premium' | 'feature' | 'product'
}

// Mock ad data - in real app, this would come from an ad service
const mockAds: Record<string, AdData[]> = {
  'dashboard-top': [
    {
      id: '1',
      title: 'Upgrade to Pro',
      description: 'Unlock unlimited reminders and AI features',
      cta: 'Upgrade Now',
      url: '/pricing',
      category: 'premium'
    }
  ],
  'dashboard-sidebar': [
    {
      id: '2',
      title: 'Notion Integration',
      description: 'Sync your reminders with Notion workspaces',
      image: '/api/placeholder/300/200',
      cta: 'Try Integration',
      url: '/integrations/notion',
      sponsor: 'Notion',
      category: 'feature'
    }
  ],
  'settings-banner': [
    {
      id: '3',
      title: 'Team Collaboration',
      description: 'Share reminders with your team members',
      cta: 'Learn More',
      url: '/features/teams',
      category: 'product'
    }
  ]
}

export function AdPlacement({ type, placement, className = '' }: AdPlacementProps) {
  const [ads, setAds] = useState<AdData[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const placementAds = mockAds[placement] || []
    setAds(placementAds)
  }, [placement])

  useEffect(() => {
    // Rotate ads every 10 seconds
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [ads.length])

  const handleDismiss = () => {
    setIsDismissed(true)
    // Remember dismissal for this session
    sessionStorage.setItem(`ad-dismissed-${placement}`, 'true')
  }

  const handleClick = (url: string) => {
    // Track ad clicks
    console.log('Ad clicked:', url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Check if ad was dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem(`ad-dismissed-${placement}`)
    if (dismissed) {
      setIsVisible(false)
    }
  }, [placement])

  if (!isVisible || isDismissed || ads.length === 0) {
    return null
  }

  const currentAd = ads[currentAdIndex]
  if (!currentAd) return null

  const renderBanner = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{currentAd.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentAd.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleClick(currentAd.url)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {currentAd.cta}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Dismiss ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="relative">
        {currentAd.image && (
          <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold">Ad Image</span>
          </div>
        )}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          title="Dismiss ad"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="p-4">
        {currentAd.sponsor && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sponsored by {currentAd.sponsor}</p>
        )}
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{currentAd.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{currentAd.description}</p>
        <button
          onClick={() => handleClick(currentAd.url)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {currentAd.cta}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )

  const renderSidebar = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Featured</span>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Dismiss ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{currentAd.title}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{currentAd.description}</p>
      <button
        onClick={() => handleClick(currentAd.url)}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
      >
        {currentAd.cta}
      </button>
    </motion.div>
  )

  switch (type) {
    case 'banner':
      return renderBanner()
    case 'card':
      return renderCard()
    case 'sidebar':
      return renderSidebar()
    default:
      return renderBanner()
  }
}
