'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentMounts: number
  lastRender: number
}

export function usePerformanceMonitor(componentName: string) {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    componentMounts: 0,
    lastRender: 0
  })

  useEffect(() => {
    const startTime = performance.now()
    metricsRef.current.componentMounts++
    metricsRef.current.lastRender = Date.now()

    return () => {
      const endTime = performance.now()
      metricsRef.current.renderTime = endTime - startTime
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${componentName} Performance:`, {
          renderTime: `${metricsRef.current.renderTime.toFixed(2)}ms`,
          mounts: metricsRef.current.componentMounts,
          lastRender: new Date(metricsRef.current.lastRender).toLocaleTimeString()
        })
      }
    }
  })

  return metricsRef.current
}

// Hook for measuring expensive operations
export function usePerformanceTimer(operationName: string) {
  const startTimer = () => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      const duration = end - start
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`)
      }
      
      return duration
    }
  }

  return { startTimer }
}
