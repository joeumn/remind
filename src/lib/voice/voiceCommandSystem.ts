'use client'

import { Event } from '@/types'
import { parseNaturalLanguage } from '@/lib/utils/naturalLanguage'
import { analyzeTextForCategory } from '@/lib/utils/smartCategorization'

export interface VoiceTrigger {
  id: string
  name: string
  command: string
  isActive: boolean
  type: 'single' | 'continuous'
}

export interface ParsedVoiceCommand {
  type: 'task' | 'event' | 'mixed'
  tasks: string[]
  events: Array<{
    title: string
    date: Date
    confidence: number
  }>
  rawInput: string
  trigger: string
}

export interface VoiceProfile {
  triggers: VoiceTrigger[]
  defaultTrigger: string
  isContinuousListening: boolean
  sensitivity: number
  language: string
  autoCreate: boolean
}

const DEFAULT_TRIGGERS: VoiceTrigger[] = [
  {
    id: 'default-schedule',
    name: 'Schedule Command',
    command: 'schedule',
    isActive: true,
    type: 'single'
  },
  {
    id: 'default-remind',
    name: 'Remind Command',
    command: 'remind me',
    isActive: true,
    type: 'single'
  },
  {
    id: 'custom-wanda',
    name: 'Custom Wanda',
    command: 'hey wanda',
    isActive: false,
    type: 'continuous'
  }
]

export class VoiceCommandSystem {
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private currentProfile: VoiceProfile
  private onCommandParsed?: (command: ParsedVoiceCommand) => void
  private onError?: (error: string) => void

  constructor(profile: VoiceProfile = this.getDefaultProfile()) {
    this.currentProfile = profile
    this.initializeRecognition()
  }

  private getDefaultProfile(): VoiceProfile {
    return {
      triggers: DEFAULT_TRIGGERS,
      defaultTrigger: 'hey wanda',
      isContinuousListening: false,
      sensitivity: 0.8,
      language: 'en-US',
      autoCreate: true
    }
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      this.onError?.('Speech recognition not supported in this browser')
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = this.currentProfile.isContinuousListening
    this.recognition.interimResults = false
    this.recognition.lang = this.currentProfile.language
    this.recognition.maxAlternatives = 1

    this.recognition.onstart = () => {
      this.isListening = true
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.currentProfile.isContinuousListening) {
        this.startListening()
      }
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()
      this.processVoiceInput(transcript)
    }

    this.recognition.onerror = (event) => {
      this.onError?.(`Speech recognition error: ${event.error}`)
    }
  }

  private processVoiceInput(input: string): void {
    // Find matching trigger
    const matchedTrigger = this.findMatchingTrigger(input)
    if (!matchedTrigger) return

    // Remove trigger from input
    const cleanInput = input.replace(matchedTrigger.command.toLowerCase(), '').trim()
    
    // Parse the command
    const parsedCommand = this.parseIntelligentCommand(cleanInput)
    parsedCommand.trigger = matchedTrigger.command
    
    this.onCommandParsed?.(parsedCommand)
  }

  private findMatchingTrigger(input: string): VoiceTrigger | null {
    const activeTriggers = this.currentProfile.triggers.filter(t => t.isActive)
    
    // Sort by length (longest first) to match more specific triggers first
    const sortedTriggers = activeTriggers.sort((a, b) => b.command.length - a.command.length)
    
    for (const trigger of sortedTriggers) {
      if (input.toLowerCase().includes(trigger.command.toLowerCase())) {
        return trigger
      }
    }
    
    return null
  }

  private parseIntelligentCommand(input: string): ParsedVoiceCommand {
    const result: ParsedVoiceCommand = {
      type: 'mixed',
      tasks: [],
      events: [],
      rawInput: input,
      trigger: ''
    }

    // Split input by common separators and conjunctions
    const sentences = this.splitIntoSentences(input)
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (!trimmed) continue

      // Analyze if it's a task or event
      const analysis = this.analyzeSentenceType(trimmed)
      
      if (analysis.type === 'task') {
        result.tasks.push(trimmed)
      } else if (analysis.type === 'event') {
        const parsed = parseNaturalLanguage(trimmed)
        result.events.push({
          title: parsed.title,
          date: parsed.date,
          confidence: parsed.confidence
        })
      } else {
        // Mixed or unclear - try both interpretations
        const parsed = parseNaturalLanguage(trimmed)
        if (parsed.confidence > 0.7) {
          result.events.push({
            title: parsed.title,
            date: parsed.date,
            confidence: parsed.confidence
          })
        } else {
          result.tasks.push(trimmed)
        }
      }
    }

    // Determine overall type
    if (result.tasks.length > 0 && result.events.length > 0) {
      result.type = 'mixed'
    } else if (result.tasks.length > 0) {
      result.type = 'task'
    } else if (result.events.length > 0) {
      result.type = 'event'
    }

    return result
  }

  private splitIntoSentences(input: string): string[] {
    // Split by common separators and conjunctions
    const separators = [
      /\sand\s/i,
      /\sbut\s/i,
      /\salso\s/i,
      /\sthen\s/i,
      /\safter\s/i,
      /\sbefore\s/i,
      /\splus\s/i,
      /\s,\s/,
      /\s;\s/
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

  private analyzeSentenceType(sentence: string): { type: 'task' | 'event' | 'mixed' } {
    const lowerSentence = sentence.toLowerCase()

    // Event indicators
    const eventIndicators = [
      'meeting', 'appointment', 'call', 'conference', 'lunch', 'dinner',
      'at ', 'on ', 'tomorrow', 'today', 'next week', 'next month',
      'am', 'pm', ':', 'o\'clock', 'morning', 'afternoon', 'evening',
      'schedule', 'book', 'plan', 'set up', 'arrange'
    ]

    // Task indicators
    const taskIndicators = [
      'get', 'buy', 'pick up', 'grab', 'remember', 'don\'t forget',
      'todo', 'task', 'need to', 'have to', 'should', 'must',
      'grocery', 'eggs', 'milk', 'bread', 'shopping', 'errand'
    ]

    const eventScore = eventIndicators.reduce((score, indicator) => 
      score + (lowerSentence.includes(indicator) ? 1 : 0), 0)
    
    const taskScore = taskIndicators.reduce((score, indicator) => 
      score + (lowerSentence.includes(indicator) ? 1 : 0), 0)

    // Time-based analysis
    const hasTime = /\d{1,2}:\d{2}|\d{1,2}\s*(am|pm)|tomorrow|today|next|morning|afternoon|evening/.test(lowerSentence)
    
    if (hasTime || eventScore > taskScore) {
      return { type: 'event' }
    } else if (taskScore > eventScore) {
      return { type: 'task' }
    } else {
      return { type: 'mixed' }
    }
  }

  public startListening(): void {
    if (!this.recognition || this.isListening) return
    
    try {
      this.recognition.start()
    } catch (error) {
      this.onError?.('Failed to start voice recognition')
    }
  }

  public stopListening(): void {
    if (!this.recognition || !this.isListening) return
    
    this.recognition.stop()
  }

  public updateProfile(profile: VoiceProfile): void {
    this.currentProfile = profile
    this.initializeRecognition()
  }

  public addTrigger(trigger: VoiceTrigger): void {
    this.currentProfile.triggers.push(trigger)
  }

  public removeTrigger(triggerId: string): void {
    this.currentProfile.triggers = this.currentProfile.triggers.filter(t => t.id !== triggerId)
  }

  public setCommandHandler(handler: (command: ParsedVoiceCommand) => void): void {
    this.onCommandParsed = handler
  }

  public setErrorHandler(handler: (error: string) => void): void {
    this.onError = handler
  }

  public getProfile(): VoiceProfile {
    return { ...this.currentProfile }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 
           !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition)
  }
}

// Global voice command system instance
let voiceSystem: VoiceCommandSystem | null = null

export function getVoiceSystem(): VoiceCommandSystem {
  if (!voiceSystem) {
    voiceSystem = new VoiceCommandSystem()
  }
  return voiceSystem
}

export function createEventFromVoiceCommand(command: ParsedVoiceCommand): Event[] {
  const events: Event[] = []

  for (const eventData of command.events) {
    const category = analyzeTextForCategory(eventData.title).category
    
    events.push({
      id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: eventData.title,
      description: `Created via voice command: "${command.trigger}"`,
      start_date: eventData.date.toISOString(),
      end_date: new Date(eventData.date.getTime() + 60 * 60 * 1000).toISOString(), // Default 1 hour
      is_all_day: false,
      location: '',
      category: category,
      priority: 'Medium',
      recurrence_type: 'None',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'current-user' // Will be set by the calling component
    })
  }

  return events
}
