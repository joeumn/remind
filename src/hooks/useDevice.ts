'use client'

import { useState, useEffect } from 'react'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  isPWA: boolean
  isInstalled: boolean
  canInstall: boolean
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'unknown'
  connection: 'slow' | 'medium' | 'fast' | 'unknown'
}

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    isPWA: false,
    isInstalled: false,
    canInstall: false,
    platform: 'unknown',
    browser: 'unknown',
    connection: 'unknown'
  })

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const platform = navigator.platform.toLowerCase()
      
      // Platform detection
      let detectedPlatform: DeviceInfo['platform'] = 'unknown'
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        detectedPlatform = 'ios'
      } else if (userAgent.includes('android')) {
        detectedPlatform = 'android'
      } else if (platform.includes('win')) {
        detectedPlatform = 'windows'
      } else if (platform.includes('mac')) {
        detectedPlatform = 'macos'
      } else if (platform.includes('linux')) {
        detectedPlatform = 'linux'
      }

      // Browser detection
      let detectedBrowser: DeviceInfo['browser'] = 'unknown'
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        detectedBrowser = 'chrome'
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        detectedBrowser = 'safari'
      } else if (userAgent.includes('firefox')) {
        detectedBrowser = 'firefox'
      } else if (userAgent.includes('edg')) {
        detectedBrowser = 'edge'
      }

      // Device type detection
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
      const isDesktop = !isMobile && !isTablet
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // PWA detection
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                   (window.navigator as any).standalone ||
                   document.referrer.includes('android-app://')

      // Installation capability
      const canInstall = 'serviceWorker' in navigator && 
                        'PushManager' in window &&
                        !isPWA

      // Connection speed detection
      let connection: DeviceInfo['connection'] = 'unknown'
      if ('connection' in navigator) {
        const conn = (navigator as any).connection
        const effectiveType = conn.effectiveType
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          connection = 'slow'
        } else if (effectiveType === '3g') {
          connection = 'medium'
        } else if (effectiveType === '4g') {
          connection = 'fast'
        }
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        isPWA,
        isInstalled: isPWA,
        canInstall,
        platform: detectedPlatform,
        browser: detectedBrowser,
        connection
      })
    }

    detectDevice()

    // Listen for display mode changes (PWA installation)
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        isPWA: mediaQuery.matches,
        isInstalled: mediaQuery.matches
      }))
    }

    mediaQuery.addEventListener('change', handleDisplayModeChange)

    // Listen for connection changes
    let handleConnectionChange: (() => void) | null = null
    
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      handleConnectionChange = () => {
        const effectiveType = conn.effectiveType
        let connection: DeviceInfo['connection'] = 'unknown'
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          connection = 'slow'
        } else if (effectiveType === '3g') {
          connection = 'medium'
        } else if (effectiveType === '4g') {
          connection = 'fast'
        }
        
        setDeviceInfo(prev => ({ ...prev, connection }))
      }

      conn.addEventListener('change', handleConnectionChange)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange)
      if ('connection' in navigator && handleConnectionChange) {
        const conn = (navigator as any).connection
        conn.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return deviceInfo
}

// Helper hook for PWA installation
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) return false

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallable(false)
      return true
    }

    return false
  }

  return {
    isInstallable,
    installPWA
  }
}
