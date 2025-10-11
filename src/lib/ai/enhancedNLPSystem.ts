                                                                                               t'use client'

import { Event, EventCategory, EventPriority } from '@/types'
import { analyzeTextForCategory } from '@/lib/utils/smartCategorization'

export interface AIAnalysis {
  intent: 'create_event' | 'create_task' | 'query_schedule' | 'optimize_schedule' | 'mixed'
  entities: {
    tasks: Array<{
      title: string
      priority: EventPriority
      estimatedDuration?: number // in minutes
      category: EventCategory
      confidence: number
    }>
    events: Array<{
      title: string
      date: Date
      duration: number // in minutes
      category: EventCategory
      priority: EventPriority
      location?: string
      confidence: number
    }>
    queries: Array<{
      type: 'schedule_overview' | 'next_event' | 'specific_date' | 'category_filter'
      parameters: Record<string, any>
      confidence: number
    }>
  }
  context: {
    urgency: 'low' | 'medium' | 'high' | 'urgent'
    timeContext: 'immediate' | 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'future'
    userPatterns: {
      preferredTimes: string[]
      commonCategories: EventCategory[]
      averageEventDuration: number
    }
  }
  suggestions: {
    optimizations: Array<{
      type: 'time_conflict' | 'travel_time' | 'energy_optimization' | 'deadline_risk'
      description: string
      impact: 'low' | 'medium' | 'high'
      confidence: number
    }>
    alternatives: Array<{
      type: 'better_time' | 'shorter_duration' | 'different_location'
      suggestion: string
      reasoning: string
    }>
  }
}

export class EnhancedNLPSystem {
  private userHistory: Array<{
    input: string
    analysis: AIAnalysis
    timestamp: Date
  }> = []

  private patterns = {
    // Enhanced time patterns with more precision
    timePatterns: [
      { regex: /at (\d{1,2}):(\d{2})\s*(am|pm)?/i, confidence: 0.95 },
      { regex: /in (\d+)\s*(minute|min|hour|hr|day|week|month)s?/i, confidence: 0.9 },
      { regex: /\btomorrow\b/i, confidence: 0.85 },
      { regex: /\btoday\b/i, confidence: 0.8 },
      { regex: /\bnext (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, confidence: 0.85 },
      { regex: /\bthis (morning|afternoon|evening|week|month)\b/i, confidence: 0.75 },
      { regex: /\b(morning|afternoon|evening)\b/i, confidence: 0.7 }
    ],
    
    // Priority indicators
    priorityPatterns: [
      { regex: /\b(urgent|asap|immediately|emergency)\b/i, priority: 'Urgent' as EventPriority, confidence: 0.9 },
      { regex: /\b(important|high priority|critical)\b/i, priority: 'High' as EventPriority, confidence: 0.8 },
      { regex: /\b(medium|moderate|normal)\b/i, priority: 'Medium' as EventPriority, confidence: 0.7 },
      { regex: /\b(low priority|whenever|sometime)\b/i, priority: 'Low' as EventPriority, confidence: 0.6 }
    ],

    // Duration patterns
    durationPatterns: [
      { regex: /(\d+)\s*(minute|min)s?\b/i, multiplier: 1 },
      { regex: /(\d+)\s*(hour|hr)s?\b/i, multiplier: 60 },
      { regex: /\bquick\b/i, duration: 15 },
      { regex: /\bbrief\b/i, duration: 30 },
      { regex: /\blong\b/i, duration: 120 },
      { regex: /\bmeeting\b/i, duration: 60 },
      { regex: /\bappointment\b/i, duration: 45 }
    ],

    // Location patterns
    locationPatterns: [
      { regex: /\b(at|in|@)\s+([a-zA-Z\s]+)\b/i, confidence: 0.8 },
      { regex: /\b(office|home|gym|hospital|court|restaurant)\b/i, confidence: 0.9 },
      { regex: /\b(via|through)\s+(zoom|teams|skype|phone|video)\b/i, confidence: 0.95 }
    ],

    // Query patterns
    queryPatterns: [
      { regex: /\bwhat.*schedule\b/i, type: 'schedule_overview' as const, confidence: 0.9 },
      { regex: /\bwhen.*next\b/i, type: 'next_event' as const, confidence: 0.85 },
      { regex: /\bwhat.*coming up\b/i, type: 'schedule_overview' as const, confidence: 0.8 },
      { regex: /\bcourt date\b/i, type: 'category_filter' as const, confidence: 0.95 },
      { regex: /\bwhat.*today\b/i, type: 'specific_date' as const, confidence: 0.9 }
    ]
  }

  public analyzeInput(input: string, userPreferences?: any): AIAnalysis {
    const normalizedInput = input.toLowerCase().trim()
    
    // Analyze intent
    const intent = this.detectIntent(normalizedInput)
    
    // Extract entities
    const entities = this.extractEntities(normalizedInput, userPreferences)
    
    // Determine context
    const context = this.analyzeContext(normalizedInput, userPreferences)
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(entities, context, userPreferences)
    
    const analysis: AIAnalysis = {
      intent,
      entities,
      context,
      suggestions
    }

    // Store in history for learning
    this.userHistory.push({
      input,
      analysis,
      timestamp: new Date()
    })

    // Keep only recent history (last 100 entries)
    if (this.userHistory.length > 100) {
      this.userHistory = this.userHistory.slice(-100)
    }

    return analysis
  }

  private detectIntent(input: string): AIAnalysis['intent'] {
    // Check for query patterns first
    if (this.patterns.queryPatterns.some(p => p.regex.test(input))) {
      return 'query_schedule'
    }

    // Check for optimization requests
    if (/\b(optimize|improve|better|reschedule)\b/i.test(input)) {
      return 'optimize_schedule'
    }

    // Check for mixed content
    const hasEvents = /\b(meeting|appointment|call|schedule|tomorrow|at \d+)\b/i.test(input)
    const hasTasks = /\b(get|buy|pick up|remember|todo|task)\b/i.test(input)
    
    if (hasEvents && hasTasks) {
      return 'mixed'
    } else if (hasEvents) {
      return 'create_event'
    } else {
      return 'create_task'
    }
  }

  private extractEntities(input: string, userPreferences?: any) {
    const entities: AIAnalysis['entities'] = {
      tasks: [],
      events: [],
      queries: []
    }

    // Extract events
    entities.events = this.extractEvents(input, userPreferences)
    
    // Extract tasks
    entities.tasks = this.extractTasks(input, userPreferences)
    
    // Extract queries
    entities.queries = this.extractQueries(input)

    return entities
  }

  private extractEvents(input: string, userPreferences?: any) {
    const events: AIAnalysis['entities']['events'] = []
    
    // Split input into potential event sentences
    const sentences = this.splitIntoSentences(input)
    
    for (const sentence of sentences) {
      if (this.isEventSentence(sentence)) {
        const event = this.parseEvent(sentence, userPreferences)
        if (event) {
          events.push(event)
        }
      }
    }

    return events
  }

  private extractTasks(input: string, userPreferences?: any) {
    const tasks: AIAnalysis['entities']['tasks'] = []
    
    const sentences = this.splitIntoSentences(input)
    
    for (const sentence of sentences) {
      if (this.isTaskSentence(sentence)) {
        const task = this.parseTask(sentence, userPreferences)
        if (task) {
          tasks.push(task)
        }
      }
    }

    return tasks
  }

  private extractQueries(input: string) {
    const queries: AIAnalysis['entities']['queries'] = []
    
    for (const pattern of this.patterns.queryPatterns) {
      const match = input.match(pattern.regex)
      if (match) {
        queries.push({
          type: pattern.type,
          parameters: { match: match[0] },
          confidence: pattern.confidence
        })
      }
    }

    return queries
  }

  private parseEvent(sentence: string, userPreferences?: any) {
    const normalized = sentence.toLowerCase()
    
    // Extract title (remove time/date words)
    const title = this.extractTitle(sentence)
    
    // Extract date/time
    const date = this.extractDateTime(sentence)
    
    // Extract duration
    const duration = this.extractDuration(sentence)
    
    // Extract priority
    const priority = this.extractPriority(sentence)
    
    // Extract location
    const location = this.extractLocation(sentence)
    
    // Determine category using enhanced analysis
    const categoryAnalysis = analyzeTextForCategory(title)
    
    return {
      title,
      date,
      duration: duration || this.estimateDuration(title, userPreferences),
      category: categoryAnalysis.category,
      priority,
      location,
      confidence: this.calculateConfidence(sentence, title, date)
    }
  }

  private parseTask(sentence: string, userPreferences?: any) {
    const normalized = sentence.toLowerCase()
    
    const title = this.extractTitle(sentence)
    const priority = this.extractPriority(sentence)
    const duration = this.extractDuration(sentence)
    const categoryAnalysis = analyzeTextForCategory(title)
    
    return {
      title,
      priority,
      estimatedDuration: duration || this.estimateDuration(title, userPreferences),
      category: categoryAnalysis.category,
      confidence: this.calculateConfidence(sentence, title)
    }
  }

  private extractTitle(sentence: string): string {
    // Remove time, date, and common trigger words
    let title = sentence
      .replace(/\b(at|on|tomorrow|today|next|this|morning|afternoon|evening)\b/gi, '')
      .replace(/\b(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))\b/gi, '')
      .replace(/\b(meeting|appointment|call|schedule|remind|get|buy|pick up)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Clean up common artifacts
    title = title.replace(/^(to|and|or|but)\s+/i, '')
    
    return title || sentence // Fallback to original if nothing left
  }

  private extractDateTime(sentence: string): Date {
    const now = new Date()
    
    // Specific time patterns
    const timeMatch = sentence.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      const period = timeMatch[3]?.toLowerCase()
      
      if (period === 'pm' && hours < 12) hours += 12
      if (period === 'am' && hours === 12) hours = 0
      
      const date = new Date(now)
      date.setHours(hours, minutes, 0, 0)
      
      // If time has passed today, assume tomorrow
      if (date <= now) {
        date.setDate(date.getDate() + 1)
      }
      
      return date
    }
    
    // Relative time patterns
    if (/\btomorrow\b/i.test(sentence)) {
      const date = new Date(now)
      date.setDate(date.getDate() + 1)
      date.setHours(9, 0, 0, 0) // Default to 9 AM
      return date
    }
    
    if (/\btoday\b/i.test(sentence)) {
      const date = new Date(now)
      date.setHours(now.getHours() + 1, 0, 0, 0) // Default to 1 hour from now
      return date
    }
    
    // Default to 1 hour from now
    const date = new Date(now)
    date.setHours(date.getHours() + 1, 0, 0, 0)
    return date
  }

  private extractDuration(sentence: string): number | null {
    for (const pattern of this.patterns.durationPatterns) {
      if ('regex' in pattern) {
        const match = sentence.match(pattern.regex)
        if (match) {
          if ('multiplier' in pattern) {
            return parseInt(match[1]) * pattern.multiplier
          }
        }
      } else if ('duration' in pattern) {
        if (pattern.regex.test(sentence)) {
          return pattern.duration
        }
      }
    }
    return null
  }

  private extractPriority(sentence: string): EventPriority {
    for (const pattern of this.patterns.priorityPatterns) {
      if (pattern.regex.test(sentence)) {
        return pattern.priority
      }
    }
    return 'Medium' // Default priority
  }

  private extractLocation(sentence: string): string | undefined {
    for (const pattern of this.patterns.locationPatterns) {
      const match = sentence.match(pattern.regex)
      if (match) {
        return match[2] || match[1]
      }
    }
    return undefined
  }

  private isEventSentence(sentence: string): boolean {
    const eventIndicators = [
      'meeting', 'appointment', 'call', 'conference', 'lunch', 'dinner',
      'at ', 'on ', 'tomorrow', 'today', 'next week', 'next month',
      'am', 'pm', ':', 'o\'clock', 'morning', 'afternoon', 'evening',
      'schedule', 'book', 'plan', 'set up', 'arrange'
    ]
    
    return eventIndicators.some(indicator => 
      sentence.toLowerCase().includes(indicator.toLowerCase())
    )
  }

  private isTaskSentence(sentence: string): boolean {
    const taskIndicators = [
      'get', 'buy', 'pick up', 'grab', 'remember', 'don\'t forget',
      'todo', 'task', 'need to', 'have to', 'should', 'must',
      'grocery', 'eggs', 'milk', 'bread', 'shopping', 'errand'
    ]
    
    return taskIndicators.some(indicator => 
      sentence.toLowerCase().includes(indicator.toLowerCase())
    )
  }

  private estimateDuration(title: string, userPreferences?: any): number {
    const normalized = title.toLowerCase()
    
    // Use user's average if available
    if (userPreferences?.averageEventDuration) {
      return userPreferences.averageEventDuration
    }
    
    // Estimate based on keywords
    if (/\b(quick|brief|short)\b/.test(normalized)) return 15
    if (/\b(meeting|call|appointment)\b/.test(normalized)) return 60
    if (/\b(long|extended|full)\b/.test(normalized)) return 120
    if (/\b(grocery|shopping|errand)\b/.test(normalized)) return 30
    
    return 60 // Default 1 hour
  }

  private calculateConfidence(sentence: string, title: string, date?: Date): number {
    let confidence = 0.5 // Base confidence
    
    // Increase confidence based on clear indicators
    if (date && date > new Date()) confidence += 0.2
    if (title.length > 3) confidence += 0.1
    if (/\b(at|on|tomorrow|today)\b/i.test(sentence)) confidence += 0.2
    if (/\d{1,2}:\d{2}/.test(sentence)) confidence += 0.3
    
    return Math.min(confidence, 1.0)
  }

  private splitIntoSentences(input: string): string[] {
    const separators = [
      /\sand\s/i, /\sbut\s/i, /\salso\s/i, /\sthen\s/i,
      /\safter\s/i, /\sbefore\s/i, /\splus\s/i, /\s,\s/, /\s;\s/
    ]
    
    let sentences = [input]
    for (const separator of separators) {
      const newSentences: string[] = []
      for (const sentence of sentences) {
        newSentences.push(...sentence.split(separator))
      }
      sentences = newSentences
    }
    
    return sentences.filter(s => s.trim().length > 0)
  }

  private analyzeContext(input: string, userPreferences?: any) {
    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
    if (/\b(urgent|asap|emergency)\b/i.test(input)) urgency = 'urgent'
    else if (/\b(important|soon)\b/i.test(input)) urgency = 'high'
    else if (/\b(whenever|sometime)\b/i.test(input)) urgency = 'low'
    
    // Determine time context
    let timeContext: 'immediate' | 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'future' = 'future'
    if (/\b(now|immediately|asap)\b/i.test(input)) timeContext = 'immediate'
    else if (/\btoday\b/i.test(input)) timeContext = 'today'
    else if (/\btomorrow\b/i.test(input)) timeContext = 'tomorrow'
    else if (/\bthis week\b/i.test(input)) timeContext = 'this_week'
    else if (/\bthis month\b/i.test(input)) timeContext = 'this_month'
    
    return {
      urgency,
      timeContext,
      userPatterns: userPreferences || {
        preferredTimes: [],
        commonCategories: [],
        averageEventDuration: 60
      }
    }
  }

  private generateSuggestions(entities: AIAnalysis['entities'], context: AIAnalysis['context'], userPreferences?: any) {
    const suggestions = {
      optimizations: [] as AIAnalysis['suggestions']['optimizations'],
      alternatives: [] as AIAnalysis['suggestions']['alternatives']
    }
    
    // Check for time conflicts
    if (entities.events.length > 1) {
      suggestions.optimizations.push({
        type: 'time_conflict',
        description: 'Multiple events scheduled close together',
        impact: 'high',
        confidence: 0.8
      })
    }
    
    // Check for travel time
    if (entities.events.some(e => e.location)) {
      suggestions.optimizations.push({
        type: 'travel_time',
        description: 'Consider travel time between locations',
        impact: 'medium',
        confidence: 0.7
      })
    }
    
    // Energy optimization suggestions
    if (entities.events.length > 3) {
      suggestions.optimizations.push({
        type: 'energy_optimization',
        description: 'Heavy schedule - consider spreading events',
        impact: 'medium',
        confidence: 0.6
      })
    }
    
    return suggestions
  }

  // Learning methods
  public getUserPatterns() {
    const recentHistory = this.userHistory.slice(-20) // Last 20 interactions
    
    const patterns = {
      preferredTimes: [] as string[],
      commonCategories: [] as EventCategory[],
      averageEventDuration: 60
    }
    
    // Analyze patterns from history
    for (const entry of recentHistory) {
      const { analysis } = entry
      
      // Extract time preferences
      analysis.entities.events.forEach(event => {
        const timeStr = event.date.toTimeString().slice(0, 5)
        patterns.preferredTimes.push(timeStr)
      })
      
      // Extract category preferences
      analysis.entities.events.forEach(event => {
        patterns.commonCategories.push(event.category)
      })
      
      // Calculate average duration
      const durations = analysis.entities.events.map(e => e.duration)
      if (durations.length > 0) {
        patterns.averageEventDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      }
    }
    
    return patterns
  }

  public getOptimizationSuggestions(currentSchedule: Event[]): AIAnalysis['suggestions']['optimizations'] {
    const suggestions: AIAnalysis['suggestions']['optimizations'] = []
    
    // Check for conflicts
    for (let i = 0; i < currentSchedule.length; i++) {
      for (let j = i + 1; j < currentSchedule.length; j++) {
        const event1 = currentSchedule[i]
        const event2 = currentSchedule[j]
        
        const start1 = new Date(event1.start_date)
        const end1 = new Date(event1.end_date)
        const start2 = new Date(event2.start_date)
        const end2 = new Date(event2.end_date)
        
        if (start1 < end2 && start2 < end1) {
          suggestions.push({
            type: 'time_conflict',
            description: `Conflict between "${event1.title}" and "${event2.title}"`,
            impact: 'high',
            confidence: 0.9
          })
        }
      }
    }
    
    // Check for deadline risks
    const urgentEvents = currentSchedule.filter(e => e.priority === 'Urgent')
    if (urgentEvents.length > 2) {
      suggestions.push({
        type: 'deadline_risk',
        description: 'Multiple urgent events - risk of deadline conflicts',
        impact: 'high',
        confidence: 0.8
      })
    }
    
    return suggestions
  }
}

// Global instance
let enhancedNLPSystem: EnhancedNLPSystem | null = null

export function getEnhancedNLPSystem(): EnhancedNLPSystem {
  if (!enhancedNLPSystem) {
    enhancedNLPSystem = new EnhancedNLPSystem()
  }
  return enhancedNLPSystem
}
