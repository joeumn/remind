'use client'

import { useEffect } from 'react'
import { registerServiceWorker, requestNotificationPermission, subscribeToPushNotifications } from '@/utils/registerSW'

export function PWAInitializer() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()

    // Request notification permission on first visit
    const hasRequestedPermissions = localStorage.getItem('remind-permissions-requested')
    if (!hasRequestedPermissions) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          subscribeToPushNotifications()
        }
        localStorage.setItem('remind-permissions-requested', 'true')
      })
    }

    // Handle app installation
    const handleBeforeInstallPrompt = (e: Event) => {
      // Store the event for later use
      ;(window as Window & { deferredPrompt?: Event }).deferredPrompt = e
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      // Track installation event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'app_installed'
        })
      }
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // Handle display mode changes
    const handleDisplayModeChange = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      if (isStandalone) {
        console.log('Running as PWA')
        // Track PWA usage
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_usage', {
            event_category: 'engagement',
            event_label: 'running_as_pwa'
          })
        }
      }
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', handleDisplayModeChange)
    handleDisplayModeChange() // Check initial state

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      mediaQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [])

  return null // This component doesn't render anything
}
