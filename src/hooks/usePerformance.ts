'use client'

import { useState, useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage: number
  isSlowConnection: boolean
  isLowEndDevice: boolean
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    isSlowConnection: false,
    isLowEndDevice: false
  })

  const [optimizations, setOptimizations] = useState({
    reducedAnimations: false,
    lowQualityImages: false,
    minimalUI: false,
    offlineMode: false
  })

  useEffect(() => {
    const measurePerformance = () => {
      // Measure page load time
      const loadTime = performance.now()
      
      // Measure render time
      const renderTime = performance.getEntriesByType('measure')
        .find(entry => entry.name === 'render')?.duration || 0

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0

      // Detect slow connection
      const connection = (navigator as any).connection
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.downlink < 1
      )

      // Detect low-end device
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      const deviceMemory = (navigator as any).deviceMemory || 4
      const isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 2

      setMetrics({
        loadTime,
        renderTime,
        interactionTime: 0, // Will be measured on interactions
        memoryUsage,
        isSlowConnection: !!isSlowConnection,
        isLowEndDevice
      })

      // Apply automatic optimizations
      if (isSlowConnection || isLowEndDevice) {
        setOptimizations({
          reducedAnimations: true,
          lowQualityImages: true,
          minimalUI: isLowEndDevice,
          offlineMode: false
        })
      }
    }

    // Measure initial performance
    if (typeof window !== 'undefined') {
      measurePerformance()
    }
  }, [])

  const measureInteraction = useCallback((name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    
    const interactionTime = end - start
    
    setMetrics(prev => ({
      ...prev,
      interactionTime
    }))

    // Log slow interactions
    if (interactionTime > 100) {
      console.warn(`Slow interaction: ${name} took ${interactionTime}ms`)
    }
  }, [])

  const optimizeForDevice = useCallback((deviceType: 'mobile' | 'tablet' | 'desktop') => {
    const newOptimizations = { ...optimizations }

    switch (deviceType) {
      case 'mobile':
        newOptimizations.reducedAnimations = true
        newOptimizations.minimalUI = true
        break
      case 'tablet':
        newOptimizations.reducedAnimations = false
        newOptimizations.minimalUI = false
        break
      case 'desktop':
        newOptimizations.reducedAnimations = false
        newOptimizations.minimalUI = false
        newOptimizations.lowQualityImages = false
        break
    }

    setOptimizations(newOptimizations)
  }, [optimizations])

  const enableOfflineMode = useCallback(() => {
    setOptimizations(prev => ({ ...prev, offlineMode: true }))
  }, [])

  const disableOfflineMode = useCallback(() => {
    setOptimizations(prev => ({ ...prev, offlineMode: false }))
  }, [])

  return {
    metrics,
    optimizations,
    measureInteraction,
    optimizeForDevice,
    enableOfflineMode,
    disableOfflineMode
  }
}

// Hook for lazy loading with performance monitoring
export function useLazyLoad<T>(
  importFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadComponent = useCallback(async () => {
    if (component || loading) return

    setLoading(true)
    setError(null)

    try {
      const start = performance.now()
      const loadedComponent = await importFn()
      const end = performance.now()

      setComponent(loadedComponent)

      // Log loading time
      console.log(`Lazy loaded component in ${end - start}ms`)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'))
    } finally {
      setLoading(false)
    }
  }, [component, loading, importFn, ...dependencies])

  return {
    component,
    loading,
    error,
    loadComponent
  }
}

// Hook for image optimization
export function useOptimizedImage(src: string, options: {
  quality?: number
  width?: number
  height?: number
  format?: 'webp' | 'jpeg' | 'png'
} = {}) {
  const [optimizedSrc, setOptimizedSrc] = useState(src)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const optimizeImage = async () => {
      try {
        setLoading(true)
        setError(false)

        // In a real app, this would call an image optimization service
        const params = new URLSearchParams()
        if (options.quality) params.set('q', options.quality.toString())
        if (options.width) params.set('w', options.width.toString())
        if (options.height) params.set('h', options.height.toString())
        if (options.format) params.set('f', options.format)

        const optimizedUrl = params.toString() 
          ? `${src}?${params.toString()}`
          : src

        // Test if image loads
        const img = new Image()
        img.onload = () => {
          setOptimizedSrc(optimizedUrl)
          setLoading(false)
        }
        img.onerror = () => {
          setOptimizedSrc(src) // Fallback to original
          setLoading(false)
          setError(true)
        }
        img.src = optimizedUrl
      } catch (err) {
        setOptimizedSrc(src)
        setLoading(false)
        setError(true)
      }
    }

    optimizeImage()
  }, [src, options.quality, options.width, options.height, options.format])

  return {
    src: optimizedSrc,
    loading,
    error
  }
}
