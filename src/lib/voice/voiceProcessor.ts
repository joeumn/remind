'use client'

import { Event } from '@/types'

interface VoiceProcessingResult {
  title: string
  description?: string
  due_at?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  tags: string[]
  confidence: number
}

export class VoiceProcessor {
  private static instance: VoiceProcessor
  private recognition: any
  private isListening = false
  private onResult?: (result: VoiceProcessingResult) => void
  private onError?: (error: string) => void

  private constructor() {
    if (typeof window !== 'undefined') {
      this.recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)()
      this.setupRecognition()
    }
  }

  static getInstance(): VoiceProcessor {
    if (!VoiceProcessor.instance) {
      VoiceProcessor.instance = new VoiceProcessor()
    }
    return VoiceProcessor.instance
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = 'en-US'
    this.recognition.maxAlternatives = 1

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      const confidence = event.results[0][0].confidence
      
      try {
        const result = this.processTranscript(transcript, confidence)
        this.onResult?.(result)
      } catch (error) {
        this.onError?.(error instanceof Error ? error.message : 'Processing failed')
      }
    }

    this.recognition.onerror = (event: any) => {
      this.onError?.(event.error)
    }

    this.recognition.onend = () => {
      this.isListening = false
    }
  }

  private processTranscript(transcript: string, confidence: number): VoiceProcessingResult {
    const normalized = transcript.toLowerCase().trim()
    
    // Extract priority
    const priority = this.extractPriority(normalized)
    
    // Extract due date/time
    const due_at = this.extractDueDate(normalized)
    
    // Extract category
    const category = this.extractCategory(normalized)
    
    // Extract tags
    const tags = this.extractTags(normalized)
    
    // Clean title
    const title = this.cleanTitle(normalized)
    
    // Generate description if needed
    const description = this.generateDescription(normalized, title)

    return {
      title,
      description,
      due_at,
      priority,
      category,
      tags,
      confidence
    }
  }

  private extractPriority(text: string): 'low' | 'medium' | 'high' | 'urgent' {
    if (text.includes('urgent') || text.includes('asap') || text.includes('emergency')) {
      return 'urgent'
    }
    if (text.includes('important') || text.includes('high priority') || text.includes('critical')) {
      return 'high'
    }
    if (text.includes('low priority') || text.includes('whenever') || text.includes('sometime')) {
      return 'low'
    }
    return 'medium'
  }

  private extractDueDate(text: string): string | undefined {
    const now = new Date()
    
    // Today
    if (text.includes('today')) {
      return now.toISOString()
    }
    
    // Tomorrow
    if (text.includes('tomorrow')) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString()
    }
    
    // Next week
    if (text.includes('next week')) {
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      return nextWeek.toISOString()
    }
    
    // Specific times
    const timePatterns = [
      { pattern: /(\d{1,2}):(\d{2})\s*(am|pm)/i, format: (match: RegExpMatchArray) => {
        const hour = parseInt(match[1])
        const minute = parseInt(match[2])
        const period = match[3].toLowerCase()
        const date = new Date(now)
        date.setHours(period === 'pm' && hour !== 12 ? hour + 12 : hour, minute, 0, 0)
        return date.toISOString()
      }},
      { pattern: /(\d{1,2})\s*(am|pm)/i, format: (match: RegExpMatchArray) => {
        const hour = parseInt(match[1])
        const period = match[3].toLowerCase()
        const date = new Date(now)
        date.setHours(period === 'pm' && hour !== 12 ? hour + 12 : hour, 0, 0, 0)
        return date.toISOString()
      }},
      { pattern: /in (\d+)\s*(minute|hour|day)s?/i, format: (match: RegExpMatchArray) => {
        const amount = parseInt(match[1])
        const unit = match[2].toLowerCase()
        const date = new Date(now)
        if (unit === 'minute') date.setMinutes(date.getMinutes() + amount)
        else if (unit === 'hour') date.setHours(date.getHours() + amount)
        else if (unit === 'day') date.setDate(date.getDate() + amount)
        return date.toISOString()
      }}
    ]
    
    for (const { pattern, format } of timePatterns) {
      const match = text.match(pattern)
      if (match) {
        return format(match)
      }
    }
    
    return undefined
  }

  private extractCategory(text: string): string | undefined {
    const categories = [
      'work', 'personal', 'health', 'finance', 'shopping', 'travel',
      'meeting', 'appointment', 'deadline', 'task', 'project'
    ]
    
    for (const category of categories) {
      if (text.includes(category)) {
        return category
      }
    }
    
    return undefined
  }

  private extractTags(text: string): string[] {
    const tags: string[] = []
    
    // Common tag patterns
    if (text.includes('call') || text.includes('phone')) tags.push('call')
    if (text.includes('email')) tags.push('email')
    if (text.includes('meeting')) tags.push('meeting')
    if (text.includes('buy') || text.includes('purchase')) tags.push('shopping')
    if (text.includes('doctor') || text.includes('medical')) tags.push('health')
    if (text.includes('pay') || text.includes('bill')) tags.push('finance')
    
    return tags
  }

  private cleanTitle(text: string): string {
    // Remove common prefixes
    let cleaned = text
      .replace(/^(remind me to|remind me|set reminder|create reminder|add reminder)/i, '')
      .replace(/^(please|can you|could you)/i, '')
      .trim()
    
    // Remove time/date references from title
    cleaned = cleaned
      .replace(/\b(today|tomorrow|next week|next month)\b/gi, '')
      .replace(/\b(\d{1,2}):(\d{2})\s*(am|pm)\b/gi, '')
      .replace(/\b(\d{1,2})\s*(am|pm)\b/gi, '')
      .replace(/\bin (\d+)\s*(minute|hour|day)s?\b/gi, '')
      .replace(/\b(urgent|important|high priority|low priority|asap|emergency)\b/gi, '')
      .trim()
    
    // Capitalize first letter
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  private generateDescription(text: string, title: string): string | undefined {
    // If the original text is significantly different from the cleaned title,
    // use it as description
    if (text.length > title.length * 1.5) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
    return undefined
  }

  startListening(onResult: (result: VoiceProcessingResult) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError('Speech recognition not supported')
      return
    }

    if (this.isListening) {
      onError('Already listening')
      return
    }

    this.onResult = onResult
    this.onError = onError
    this.isListening = true
    
    try {
      this.recognition.start()
    } catch (error) {
      this.isListening = false
      onError('Failed to start recognition')
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  getSupportedLanguages(): string[] {
    return ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE']
  }

  setLanguage(language: string) {
    if (this.recognition) {
      this.recognition.lang = language
    }
  }
}
