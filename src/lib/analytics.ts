// Analytics and monitoring utilities
export interface AnalyticsEvent {
  event_type: string
  event_data?: Record<string, unknown>
  user_id?: string
  session_id?: string
}

export class Analytics {
  private static instance: Analytics
  private events: AnalyticsEvent[] = []
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  track(eventType: string, eventData?: Record<string, unknown>, userId?: string) {
    const event: AnalyticsEvent = {
      event_type: eventType,
      event_data: eventData,
      user_id: userId,
      session_id: this.sessionId
    }

    this.events.push(event)

    // Send to analytics service
    this.sendEvent(event)

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventType, {
        event_category: eventData?.category || 'general',
        event_label: eventData?.label,
        value: eventData?.value,
        user_id: userId
      })
    }
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('remind-auth-token') || 'anonymous'}`
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }

  // Predefined event tracking methods
  trackPageView(page: string, userId?: string) {
    this.track('page_view', { page }, userId)
  }

  trackEventCreated(eventId: string, category: string, userId?: string) {
    this.track('event_created', { event_id: eventId, category }, userId)
  }

  trackEventCompleted(eventId: string, userId?: string) {
    this.track('event_completed', { event_id: eventId }, userId)
  }

  trackFeatureUsed(feature: string, userId?: string) {
    this.track('feature_used', { feature }, userId)
  }

  trackError(error: string, context?: Record<string, unknown>, userId?: string) {
    this.track('error', { error, context }, userId)
  }

  trackPerformance(metric: string, value: number, userId?: string) {
    this.track('performance', { metric, value }, userId)
  }

  trackUserEngagement(action: string, userId?: string) {
    this.track('user_engagement', { action }, userId)
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance()

// Performance monitoring
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.then(() => {
      const end = performance.now()
      const duration = end - start
      analytics.trackPerformance(name, duration)
      return duration
    })
  } else {
    const end = performance.now()
    const duration = end - start
    analytics.trackPerformance(name, duration)
    return duration
  }
}
