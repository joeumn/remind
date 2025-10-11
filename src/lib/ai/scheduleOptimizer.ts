'use client'

import { Event, EventCategory, EventPriority } from '@/types'

export interface OptimizationSuggestion {
  id: string
  type: 'time_conflict' | 'travel_time' | 'energy_optimization' | 'deadline_risk' | 'better_timing' | 'duration_optimization'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  affectedEvents: string[]
  suggestions: Array<{
    action: string
    reasoning: string
    estimatedBenefit: string
  }>
  alternatives: Array<{
    originalTime: Date
    suggestedTime: Date
    reasoning: string
    confidence: number
  }>
}

export interface ScheduleAnalysis {
  totalEvents: number
  conflicts: number
  travelTime: number
  energyScore: number
  deadlineRisk: number
  optimizations: OptimizationSuggestion[]
  overallScore: number // 0-100
  recommendations: string[]
}

export class ScheduleOptimizer {
  private userPreferences: {
    workHours: { start: number; end: number } // 24-hour format
    preferredBreakTime: number // minutes
    maxConsecutiveEvents: number
    travelBuffer: number // minutes
    energyLevels: {
      morning: number
      afternoon: number
      evening: number
    }
  }

  constructor(userPreferences?: Partial<ScheduleOptimizer['userPreferences']>) {
    this.userPreferences = {
      workHours: { start: 9, end: 17 },
      preferredBreakTime: 15,
      maxConsecutiveEvents: 4,
      travelBuffer: 15,
      energyLevels: {
        morning: 0.9,
        afternoon: 0.7,
        evening: 0.5
      },
      ...userPreferences
    }
  }

  public analyzeSchedule(events: Event[]): ScheduleAnalysis {
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )

    const optimizations = this.findOptimizations(sortedEvents)
    const conflicts = this.detectConflicts(sortedEvents)
    const travelTime = this.calculateTravelTime(sortedEvents)
    const energyScore = this.calculateEnergyScore(sortedEvents)
    const deadlineRisk = this.assessDeadlineRisk(sortedEvents)

    const overallScore = this.calculateOverallScore({
      conflicts,
      travelTime,
      energyScore,
      deadlineRisk,
      optimizations: optimizations.length
    })

    const recommendations = this.generateRecommendations(optimizations, overallScore)

    return {
      totalEvents: events.length,
      conflicts,
      travelTime,
      energyScore,
      deadlineRisk,
      optimizations,
      overallScore,
      recommendations
    }
  }

  private findOptimizations(events: Event[]): OptimizationSuggestion[] {
    const optimizations: OptimizationSuggestion[] = []

    // Check for time conflicts
    optimizations.push(...this.findTimeConflicts(events))

    // Check for travel time issues
    optimizations.push(...this.findTravelTimeIssues(events))

    // Check for energy optimization opportunities
    optimizations.push(...this.findEnergyOptimizations(events))

    // Check for deadline risks
    optimizations.push(...this.findDeadlineRisks(events))

    // Check for better timing opportunities
    optimizations.push(...this.findBetterTiming(events))

    // Check for duration optimizations
    optimizations.push(...this.findDurationOptimizations(events))

    return optimizations.sort((a, b) => {
      const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return impactOrder[b.impact] - impactOrder[a.impact] || b.confidence - a.confidence
    })
  }

  private findTimeConflicts(events: Event[]): OptimizationSuggestion[] {
    const conflicts: OptimizationSuggestion[] = []

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i]
        const event2 = events[j]

        const start1 = new Date(event1.start_date)
        const end1 = new Date(event1.end_date)
        const start2 = new Date(event2.start_date)
        const end2 = new Date(event2.end_date)

        if (start1 < end2 && start2 < end1) {
          const overlap = Math.min(end1.getTime(), end2.getTime()) - Math.max(start1.getTime(), start2.getTime())
          const overlapMinutes = overlap / (1000 * 60)

          conflicts.push({
            id: `conflict-${event1.id}-${event2.id}`,
            type: 'time_conflict',
            title: 'Time Conflict Detected',
            description: `${event1.title} and ${event2.title} overlap by ${Math.round(overlapMinutes)} minutes`,
            impact: overlapMinutes > 30 ? 'high' : 'medium',
            confidence: 0.95,
            affectedEvents: [event1.id, event2.id],
            suggestions: [
              {
                action: 'Reschedule one of the events',
                reasoning: 'Overlapping events can cause stress and missed commitments',
                estimatedBenefit: `Save ${Math.round(overlapMinutes)} minutes and reduce stress`
              }
            ],
            alternatives: this.generateTimeAlternatives(event1, event2)
          })
        }
      }
    }

    return conflicts
  }

  private findTravelTimeIssues(events: Event[]): OptimizationSuggestion[] {
    const issues: OptimizationSuggestion[] = []

    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]

      if (currentEvent.location && nextEvent.location) {
        const travelTime = this.estimateTravelTime(currentEvent.location, nextEvent.location)
        const timeBetween = new Date(nextEvent.start_date).getTime() - new Date(currentEvent.end_date).getTime()
        const timeBetweenMinutes = timeBetween / (1000 * 60)

        if (timeBetweenMinutes < travelTime + this.userPreferences.travelBuffer) {
          issues.push({
            id: `travel-${currentEvent.id}-${nextEvent.id}`,
            type: 'travel_time',
            title: 'Insufficient Travel Time',
            description: `Only ${Math.round(timeBetweenMinutes)} minutes between ${currentEvent.title} and ${nextEvent.title}, but ${Math.round(travelTime)} minutes travel time needed`,
            impact: timeBetweenMinutes < travelTime ? 'high' : 'medium',
            confidence: 0.85,
            affectedEvents: [currentEvent.id, nextEvent.id],
            suggestions: [
              {
                action: 'Add buffer time between events',
                reasoning: 'Insufficient travel time can cause lateness and stress',
                estimatedBenefit: `Reduce lateness risk and improve punctuality`
              }
            ],
            alternatives: this.generateTravelAlternatives(currentEvent, nextEvent, travelTime)
          })
        }
      }
    }

    return issues
  }

  private findEnergyOptimizations(events: Event[]): OptimizationSuggestion[] {
    const optimizations: OptimizationSuggestion[] = []

    // Check for too many consecutive events
    let consecutiveCount = 1
    let consecutiveStart = 0

    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]

      const timeBetween = new Date(nextEvent.start_date).getTime() - new Date(currentEvent.end_date).getTime()
      const timeBetweenMinutes = timeBetween / (1000 * 60)

      if (timeBetweenMinutes <= this.userPreferences.preferredBreakTime) {
        consecutiveCount++
      } else {
        if (consecutiveCount > this.userPreferences.maxConsecutiveEvents) {
          const affectedEvents = events.slice(consecutiveStart, consecutiveStart + consecutiveCount)
          
          optimizations.push({
            id: `energy-${consecutiveStart}-${consecutiveCount}`,
            type: 'energy_optimization',
            title: 'Energy Drain Risk',
            description: `${consecutiveCount} consecutive events without proper breaks`,
            impact: consecutiveCount > 5 ? 'high' : 'medium',
            confidence: 0.8,
            affectedEvents: affectedEvents.map(e => e.id),
            suggestions: [
              {
                action: 'Add breaks between events',
                reasoning: 'Consecutive events without breaks can lead to fatigue and poor performance',
                estimatedBenefit: 'Improved focus and productivity'
              }
            ],
            alternatives: this.generateEnergyAlternatives(affectedEvents)
          })
        }
        consecutiveCount = 1
        consecutiveStart = i + 1
      }
    }

    return optimizations
  }

  private findDeadlineRisks(events: Event[]): OptimizationSuggestion[] {
    const risks: OptimizationSuggestion[] = []

    // Check for multiple urgent events
    const urgentEvents = events.filter(e => e.priority === 'Urgent')
    if (urgentEvents.length > 2) {
      risks.push({
        id: 'deadline-risk-multiple-urgent',
        type: 'deadline_risk',
        title: 'Multiple Urgent Deadlines',
        description: `${urgentEvents.length} urgent events scheduled`,
        impact: urgentEvents.length > 4 ? 'critical' : 'high',
        confidence: 0.9,
        affectedEvents: urgentEvents.map(e => e.id),
        suggestions: [
          {
            action: 'Prioritize and reschedule some urgent events',
            reasoning: 'Too many urgent deadlines can lead to stress and missed commitments',
            estimatedBenefit: 'Reduced stress and better deadline management'
          }
        ],
        alternatives: this.generateDeadlineAlternatives(urgentEvents)
      })
    }

    // Check for back-to-back urgent events
    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]

      if (currentEvent.priority === 'Urgent' && nextEvent.priority === 'Urgent') {
        const timeBetween = new Date(nextEvent.start_date).getTime() - new Date(currentEvent.end_date).getTime()
        const timeBetweenMinutes = timeBetween / (1000 * 60)

        if (timeBetweenMinutes < 60) { // Less than 1 hour between urgent events
          risks.push({
            id: `deadline-risk-${currentEvent.id}-${nextEvent.id}`,
            type: 'deadline_risk',
            title: 'Back-to-Back Urgent Events',
            description: `Urgent events "${currentEvent.title}" and "${nextEvent.title}" are too close together`,
            impact: 'high',
            confidence: 0.85,
            affectedEvents: [currentEvent.id, nextEvent.id],
            suggestions: [
              {
                action: 'Add buffer time between urgent events',
                reasoning: 'Urgent events need adequate preparation and transition time',
                estimatedBenefit: 'Better preparation and reduced stress'
              }
            ],
            alternatives: this.generateUrgentEventAlternatives(currentEvent, nextEvent)
          })
        }
      }
    }

    return risks
  }

  private findBetterTiming(events: Event[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    events.forEach(event => {
      const eventTime = new Date(event.start_date)
      const hour = eventTime.getHours()
      const category = event.category

      // Suggest better times based on category and energy levels
      const betterTime = this.getOptimalTimeForCategory(category, hour)
      
      if (betterTime && betterTime !== hour) {
        suggestions.push({
          id: `timing-${event.id}`,
          type: 'better_timing',
          title: 'Optimal Timing Available',
          description: `${event.title} could be scheduled during peak energy time for ${category} activities`,
          impact: 'low',
          confidence: 0.7,
          affectedEvents: [event.id],
          suggestions: [
            {
              action: `Move to ${betterTime}:00 for better performance`,
              reasoning: `Energy levels are optimal for ${category} activities at this time`,
              estimatedBenefit: 'Improved focus and productivity'
            }
          ],
          alternatives: [{
            originalTime: eventTime,
            suggestedTime: new Date(eventTime.setHours(betterTime, 0, 0, 0)),
            reasoning: `Optimal energy level for ${category} activities`,
            confidence: 0.7
          }]
        })
      }
    })

    return suggestions
  }

  private findDurationOptimizations(events: Event[]): OptimizationSuggestion[] {
    const optimizations: OptimizationSuggestion[] = []

    events.forEach(event => {
      const duration = new Date(event.end_date).getTime() - new Date(event.start_date).getTime()
      const durationMinutes = duration / (1000 * 60)
      
      const suggestedDuration = this.getOptimalDurationForCategory(event.category, event.title)
      
      if (suggestedDuration && Math.abs(durationMinutes - suggestedDuration) > 15) {
        optimizations.push({
          id: `duration-${event.id}`,
          type: 'duration_optimization',
          title: 'Duration Optimization',
          description: `${event.title} could be ${suggestedDuration < durationMinutes ? 'shortened' : 'extended'} for better efficiency`,
          impact: 'low',
          confidence: 0.6,
          affectedEvents: [event.id],
          suggestions: [
            {
              action: `${suggestedDuration < durationMinutes ? 'Reduce' : 'Increase'} duration to ${suggestedDuration} minutes`,
              reasoning: `Optimal duration for ${event.category} activities`,
              estimatedBenefit: suggestedDuration < durationMinutes ? 'Time savings' : 'Better preparation'
            }
          ],
          alternatives: [{
            originalTime: new Date(event.end_date),
            suggestedTime: new Date(new Date(event.start_date).getTime() + suggestedDuration * 60000),
            reasoning: `Optimal duration for ${event.category} activities`,
            confidence: 0.6
          }]
        })
      }
    })

    return optimizations
  }

  private detectConflicts(events: Event[]): number {
    let conflicts = 0

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i]
        const event2 = events[j]

        const start1 = new Date(event1.start_date)
        const end1 = new Date(event1.end_date)
        const start2 = new Date(event2.start_date)
        const end2 = new Date(event2.end_date)

        if (start1 < end2 && start2 < end1) {
          conflicts++
        }
      }
    }

    return conflicts
  }

  private calculateTravelTime(events: Event[]): number {
    let totalTravelTime = 0

    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]

      if (currentEvent.location && nextEvent.location) {
        totalTravelTime += this.estimateTravelTime(currentEvent.location, nextEvent.location)
      }
    }

    return totalTravelTime
  }

  private calculateEnergyScore(events: Event[]): number {
    let energyScore = 100

    // Deduct for consecutive events without breaks
    let consecutiveCount = 1
    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]

      const timeBetween = new Date(nextEvent.start_date).getTime() - new Date(currentEvent.end_date).getTime()
      const timeBetweenMinutes = timeBetween / (1000 * 60)

      if (timeBetweenMinutes <= this.userPreferences.preferredBreakTime) {
        consecutiveCount++
        energyScore -= 5 * consecutiveCount // Increasing penalty for more consecutive events
      } else {
        consecutiveCount = 1
      }
    }

    // Deduct for events outside optimal hours
    events.forEach(event => {
      const hour = new Date(event.start_date).getHours()
      if (hour < this.userPreferences.workHours.start || hour > this.userPreferences.workHours.end) {
        energyScore -= 10
      }
    })

    return Math.max(energyScore, 0)
  }

  private assessDeadlineRisk(events: Event[]): number {
    let riskScore = 0

    const urgentEvents = events.filter(e => e.priority === 'Urgent')
    riskScore += urgentEvents.length * 20

    // Check for back-to-back urgent events
    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]

      if (currentEvent.priority === 'Urgent' && nextEvent.priority === 'Urgent') {
        const timeBetween = new Date(nextEvent.start_date).getTime() - new Date(currentEvent.end_date).getTime()
        const timeBetweenMinutes = timeBetween / (1000 * 60)

        if (timeBetweenMinutes < 60) {
          riskScore += 30
        }
      }
    }

    return Math.min(riskScore, 100)
  }

  private calculateOverallScore(metrics: {
    conflicts: number
    travelTime: number
    energyScore: number
    deadlineRisk: number
    optimizations: number
  }): number {
    let score = 100

    // Deduct for conflicts
    score -= metrics.conflicts * 15

    // Deduct for excessive travel time
    if (metrics.travelTime > 120) score -= 20 // More than 2 hours of travel

    // Deduct for low energy score
    score -= (100 - metrics.energyScore) * 0.3

    // Deduct for deadline risk
    score -= metrics.deadlineRisk * 0.2

    // Deduct for optimization opportunities
    score -= metrics.optimizations * 2

    return Math.max(Math.round(score), 0)
  }

  private generateRecommendations(optimizations: OptimizationSuggestion[], overallScore: number): string[] {
    const recommendations: string[] = []

    if (overallScore < 50) {
      recommendations.push('Your schedule needs significant optimization')
    } else if (overallScore < 70) {
      recommendations.push('Consider making some adjustments to improve your schedule')
    } else if (overallScore < 85) {
      recommendations.push('Your schedule is good with room for minor improvements')
    } else {
      recommendations.push('Excellent schedule optimization!')
    }

    const criticalIssues = optimizations.filter(o => o.impact === 'critical')
    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical scheduling issues immediately`)
    }

    const highImpactIssues = optimizations.filter(o => o.impact === 'high')
    if (highImpactIssues.length > 0) {
      recommendations.push(`Consider resolving ${highImpactIssues.length} high-impact scheduling issues`)
    }

    return recommendations
  }

  // Helper methods
  private estimateTravelTime(from: string, to: string): number {
    // Simple estimation based on location keywords
    // In a real app, this would use a mapping service API
    if (from.toLowerCase().includes('home') && to.toLowerCase().includes('office')) return 30
    if (from.toLowerCase().includes('office') && to.toLowerCase().includes('home')) return 30
    if (from.toLowerCase().includes('court') || to.toLowerCase().includes('court')) return 45
    if (from.toLowerCase().includes('hospital') || to.toLowerCase().includes('hospital')) return 25
    return 20 // Default 20 minutes
  }

  private getOptimalTimeForCategory(category: EventCategory, currentHour: number): number | null {
    const optimalTimes: Record<EventCategory, number[]> = {
      Work: [9, 10, 14, 15],
      Court: [9, 10, 14],
      Family: [18, 19, 20],
      Personal: [7, 8, 19, 20],
      Recovery: [7, 8, 20, 21],
      Other: [10, 11, 15, 16]
    }

    const times = optimalTimes[category]
    const currentOptimal = times.find(time => Math.abs(time - currentHour) > 2)
    return currentOptimal || null
  }

  private getOptimalDurationForCategory(category: EventCategory, title: string): number | null {
    const titleLower = title.toLowerCase()
    
    // Quick tasks
    if (titleLower.includes('quick') || titleLower.includes('brief')) return 15
    if (titleLower.includes('call') || titleLower.includes('phone')) return 30
    
    // Category-based durations
    const durations: Record<EventCategory, number> = {
      Work: 60,
      Court: 120,
      Family: 90,
      Personal: 45,
      Recovery: 60,
      Other: 60
    }

    return durations[category]
  }

  private generateTimeAlternatives(event1: Event, event2: Event) {
    // Generate alternative times for conflicting events
    const alternatives = []
    const event1Time = new Date(event1.start_date)
    const event2Time = new Date(event2.start_date)

    // Suggest moving first event earlier
    const earlierTime = new Date(event1Time)
    earlierTime.setHours(event1Time.getHours() - 1, 0, 0, 0)
    alternatives.push({
      originalTime: event1Time,
      suggestedTime: earlierTime,
      reasoning: 'Move earlier to avoid conflict',
      confidence: 0.8
    })

    // Suggest moving second event later
    const laterTime = new Date(event2Time)
    laterTime.setHours(event2Time.getHours() + 1, 0, 0, 0)
    alternatives.push({
      originalTime: event2Time,
      suggestedTime: laterTime,
      reasoning: 'Move later to avoid conflict',
      confidence: 0.8
    })

    return alternatives
  }

  private generateTravelAlternatives(event1: Event, event2: Event, travelTime: number) {
    const alternatives = []
    const event2Time = new Date(event2.start_date)
    
    // Suggest adding buffer time
    const bufferedTime = new Date(event2Time)
    bufferedTime.setMinutes(bufferedTime.getMinutes() + travelTime + this.userPreferences.travelBuffer)
    
    alternatives.push({
      originalTime: event2Time,
      suggestedTime: bufferedTime,
      reasoning: `Add ${travelTime + this.userPreferences.travelBuffer} minutes for travel`,
      confidence: 0.9
    })

    return alternatives
  }

  private generateEnergyAlternatives(events: Event[]) {
    const alternatives = []
    
    // Suggest adding breaks between events
    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i]
      const nextEvent = events[i + 1]
      
      const breakTime = new Date(currentEvent.end_date)
      breakTime.setMinutes(breakTime.getMinutes() + this.userPreferences.preferredBreakTime)
      
      alternatives.push({
        originalTime: new Date(nextEvent.start_date),
        suggestedTime: breakTime,
        reasoning: 'Add break time for better energy management',
        confidence: 0.7
      })
    }

    return alternatives
  }

  private generateDeadlineAlternatives(urgentEvents: Event[]) {
    const alternatives = []
    
    // Suggest spreading urgent events throughout the day
    urgentEvents.forEach((event, index) => {
      const originalTime = new Date(event.start_date)
      const suggestedTime = new Date(originalTime)
      
      // Spread events with 2-hour intervals
      suggestedTime.setHours(9 + (index * 2), 0, 0, 0)
      
      alternatives.push({
        originalTime,
        suggestedTime,
        reasoning: 'Spread urgent events for better deadline management',
        confidence: 0.6
      })
    })

    return alternatives
  }

  private generateUrgentEventAlternatives(event1: Event, event2: Event) {
    const alternatives = []
    
    // Move second urgent event later
    const event2Time = new Date(event2.start_date)
    const laterTime = new Date(event2Time)
    laterTime.setHours(event2Time.getHours() + 2, 0, 0, 0)
    
    alternatives.push({
      originalTime: event2Time,
      suggestedTime: laterTime,
      reasoning: 'Add buffer time between urgent events',
      confidence: 0.8
    })

    return alternatives
  }
}

// Global instance
let scheduleOptimizer: ScheduleOptimizer | null = null

export function getScheduleOptimizer(): ScheduleOptimizer {
  if (!scheduleOptimizer) {
    scheduleOptimizer = new ScheduleOptimizer()
  }
  return scheduleOptimizer
}
