// Performance monitoring and optimization utilities

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.recordMetric(name, end - start)
    return result
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    this.recordMetric(name, end - start)
    return result
  }

  recordMetric(name: string, value: number, metadata?: Record<string, unknown>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }

    this.metrics.push(metric)

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Report slow operations
    if (value > 1000) { // Slower than 1 second
      console.warn(`Slow operation detected: ${name} took ${value}ms`)
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (command: string, action: string, params: Record<string, unknown>) => void }).gtag) {
      (window as Window & { gtag: (command: string, action: string, params: Record<string, unknown>) => void }).gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(value)
      })
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name)
    }
    return [...this.metrics]
  }

  getAverageTime(name: string): number {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return 0
    
    const total = metrics.reduce((sum, metric) => sum + metric.value, 0)
    return total / metrics.length
  }

  clearMetrics() {
    this.metrics = []
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()

// Web Vitals monitoring
export function measureWebVitals() {
  if (typeof window === 'undefined') return

  // First Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        performanceMonitor.recordMetric('fcp', entry.startTime)
      }
    }
  }).observe({ entryTypes: ['paint'] })

  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]
    performanceMonitor.recordMetric('lcp', lastEntry.startTime)
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      performanceMonitor.recordMetric('fid', entry.processingStart - entry.startTime)
    }
  }).observe({ entryTypes: ['first-input'] })

  // Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    let clsValue = 0
    for (const entry of entryList.getEntries()) {
      const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
      if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
        clsValue += layoutShiftEntry.value
      }
    }
    performanceMonitor.recordMetric('cls', clsValue)
  }).observe({ entryTypes: ['layout-shift'] })
}

// Resource timing
export function measureResourceTiming() {
  if (typeof window === 'undefined') return

  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const resourceEntry = entry as PerformanceResourceTiming
      
      performanceMonitor.recordMetric('resource_load_time', 
        resourceEntry.responseEnd - resourceEntry.requestStart,
        {
          name: resourceEntry.name,
          type: resourceEntry.initiatorType,
          size: resourceEntry.transferSize
        }
      )
    }
  }).observe({ entryTypes: ['resource'] })
}

// Navigation timing
export function measureNavigationTiming() {
  if (typeof window === 'undefined') return

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  if (navigation) {
    performanceMonitor.recordMetric('dns_lookup', 
      navigation.domainLookupEnd - navigation.domainLookupStart)
    
    performanceMonitor.recordMetric('tcp_connection', 
      navigation.connectEnd - navigation.connectStart)
    
    performanceMonitor.recordMetric('request_time', 
      navigation.responseEnd - navigation.requestStart)
    
    performanceMonitor.recordMetric('dom_processing', 
      navigation.domContentLoadedEventEnd - navigation.domLoading)
    
    performanceMonitor.recordMetric('page_load', 
      navigation.loadEventEnd - navigation.navigationStart)
  }
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  measureWebVitals()
  measureResourceTiming()
  measureNavigationTiming()
}
