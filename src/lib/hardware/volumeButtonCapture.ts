'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/types'
import { getEnhancedNLPSystem } from '@/lib/ai/enhancedNLPSystem'
import { getNotificationSystem } from '@/lib/notifications/bulletproofNotifications'

interface VolumeCaptureConfig {
  enabled: boolean
  sequenceTimeout: number // milliseconds between up and down
  vibrateOnActivation: boolean
  playSoundOnActivation: boolean
  playActivationJingle: boolean
}

interface VolumeCaptureState {
  isActive: boolean
  isListening: boolean
  lastPressTime: number
  pressSequence: 'none' | 'up' | 'down'
  sequenceStartTime: number
  recognition: SpeechRecognition | null
}

export class VolumeButtonCapture {
  private config: VolumeCaptureConfig = {
    enabled: true,
    sequenceTimeout: 800, // 800ms to complete UP → DOWN sequence
    vibrateOnActivation: true,
    playSoundOnActivation: true,
    playActivationJingle: true
  }

  private state: VolumeCaptureState = {
    isActive: false,
    isListening: false,
    lastPressTime: 0,
    pressSequence: 'none',
    sequenceStartTime: 0,
    recognition: null
  }

  private listeners: Array<(event: Event) => void> = []
  private nlpSystem = getEnhancedNLPSystem()
  private notificationSystem = getNotificationSystem()

  constructor() {
    this.initializeSpeechRecognition()
    this.setupVolumeButtonListeners()
    this.setupVisibilityHandlers()
  }

  // Initialize speech recognition for background capture
  private initializeSpeechRecognition(): void {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.state.recognition = new SpeechRecognition()
      
      this.state.recognition.continuous = false
      this.state.recognition.interimResults = false
      this.state.recognition.lang = 'en-US'
      this.state.recognition.maxAlternatives = 1

      this.state.recognition.onstart = () => {
        console.log('🎤 Volume button voice capture started')
        this.state.isListening = true
        this.playActivationSound()
        this.vibrateDevice()
      }

      this.state.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        const confidence = event.results[event.results.length - 1][0].confidence
        
        console.log(`🎤 Volume capture result: "${transcript}" (confidence: ${confidence})`)
        
        if (confidence >= 0.7) { // Only process high-confidence results
          this.processVoiceInput(transcript)
        } else {
          this.showFeedback('Could not understand. Please try again.', 'error')
        }
      }

      this.state.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Volume button capture error:', event.error)
        this.state.isListening = false
        
        let errorMessage = 'Voice capture failed. Please try again.'
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone not available. Please check permissions.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable in settings.'
            break
        }
        
        this.showFeedback(errorMessage, 'error')
      }

      this.state.recognition.onend = () => {
        this.state.isListening = false
        console.log('🎤 Volume button voice capture ended')
      }
    }
  }

  // Setup volume button event listeners
  private setupVolumeButtonListeners(): void {
    // Listen for volume button events
    document.addEventListener('keydown', (event) => {
      this.handleVolumeButtonPress(event)
    })

    // Listen for media key events (for some browsers/devices)
    document.addEventListener('keyup', (event) => {
      this.handleVolumeButtonRelease(event)
    })

    // For mobile devices, we need to use different approaches
    if ('ontouchstart' in window) {
      this.setupMobileVolumeDetection()
    }
  }

  // Handle volume button press events - UP → DOWN sequence
  private handleVolumeButtonPress(event: KeyboardEvent): void {
    const now = Date.now()

    // Check for volume up/down keys
    const isVolumeUp = event.code === 'VolumeUp' || event.key === 'AudioVolumeUp'
    const isVolumeDown = event.code === 'VolumeDown' || event.key === 'AudioVolumeDown'

    if (!isVolumeUp && !isVolumeDown) return

    // Check if this is part of the UP → DOWN sequence
    if (isVolumeUp && this.state.pressSequence === 'none') {
      // Start the sequence with UP
      this.state.pressSequence = 'up'
      this.state.sequenceStartTime = now
      console.log('🎤 Volume sequence started: UP')
      return
    }

    if (isVolumeDown && this.state.pressSequence === 'up') {
      // Complete the sequence with DOWN
      const sequenceTime = now - this.state.sequenceStartTime
      
      if (sequenceTime <= this.config.sequenceTimeout) {
        // Valid UP → DOWN sequence completed!
        console.log('🎤 Volume sequence completed: UP → DOWN')
        this.activateVoiceCapture()
        this.resetSequence()
      } else {
        // Too slow, reset sequence
        this.resetSequence()
      }
      return
    }

    // If we get here, it's either:
    // 1. Volume down without prior up
    // 2. Volume up when already in sequence
    // 3. Any other invalid sequence
    this.resetSequence()
  }

  private handleVolumeButtonRelease(event: KeyboardEvent): void {
    // Handle volume button release if needed
  }

  // Reset the volume button sequence
  private resetSequence(): void {
    this.state.pressSequence = 'none'
    this.state.sequenceStartTime = 0
  }

  // Setup mobile-specific volume detection
  private setupMobileVolumeDetection(): void {
    // For mobile devices, we need to use different techniques
    // This is a simplified version - real implementation would need native app integration
    
    // Listen for hardware back button as alternative (Android)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' || event.key === 'Escape') {
        // Use as alternative trigger for mobile
        this.activateVoiceCapture()
      }
    })

    // Use device orientation as alternative trigger
    window.addEventListener('devicemotion', (event) => {
      // Detect device shake as alternative trigger
      const acceleration = event.accelerationIncludingGravity
      if (acceleration && this.detectShake(acceleration)) {
        this.activateVoiceCapture()
      }
    })
  }

  // Detect device shake
  private detectShake(acceleration: DeviceAcceleration): boolean {
    const threshold = 15 // Adjust sensitivity
    return (
      Math.abs(acceleration.x || 0) > threshold ||
      Math.abs(acceleration.y || 0) > threshold ||
      Math.abs(acceleration.z || 0) > threshold
    )
  }

  // Activate voice capture after UP → DOWN sequence
  private activateVoiceCapture(): void {
    if (!this.config.enabled || this.state.isListening) return

    console.log('🎤 Volume UP → DOWN sequence completed! Voice capture activated!')
    
    this.state.isActive = true
    
    // Play activation jingle
    this.playActivationJingle()
    
    // Show visual feedback
    this.showFeedback('🎵 UP → DOWN detected! Listening...', 'listening')
    
    // Start speech recognition
    if (this.state.recognition) {
      try {
        this.state.recognition.start()
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
        this.showFeedback('Voice capture not available', 'error')
      }
    } else {
      this.showFeedback('Voice recognition not supported', 'error')
    }
  }

  // Process voice input and create reminder
  private async processVoiceInput(transcript: string): Promise<void> {
    try {
      console.log('🎤 Processing volume button voice input:', transcript)
      
      // Analyze the voice input
      const analysis = this.nlpSystem.analyzeInput(transcript)
      
      if (analysis.entities.events.length > 0) {
        const eventData = analysis.entities.events[0]
        const event = this.createEventFromAnalysis(eventData, transcript)
        
        // Add event to store (this would integrate with your state management)
        this.notifyListeners(event)
        
        // Show success feedback
        this.showFeedback(`✅ Reminder created: "${event.title}"`, 'success')
        
        // Schedule notifications
        await this.scheduleReminders(event)
        
      } else {
        // Create a simple task reminder
        const event = this.createSimpleTask(transcript)
        this.notifyListeners(event)
        this.showFeedback(`✅ Task created: "${event.title}"`, 'success')
        await this.scheduleReminders(event)
      }
      
    } catch (error) {
      console.error('Error processing voice input:', error)
      this.showFeedback('Failed to create reminder. Please try again.', 'error')
    }
  }

  // Create event from AI analysis
  private createEventFromAnalysis(eventData: any, originalText: string): Event {
    const now = new Date()
    const eventId = `volume-capture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      id: eventId,
      title: eventData.title,
      description: `Created via volume button capture: "${originalText}"`,
      start_date: eventData.date.toISOString(),
      end_date: new Date(eventData.date.getTime() + eventData.duration * 60000).toISOString(),
      is_all_day: false,
      location: eventData.location || '',
      category: eventData.category,
      priority: eventData.priority,
      recurrence_type: 'None',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      user_id: 'current-user'
    }
  }

  // Create simple task from voice input
  private createSimpleTask(text: string): Event {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const eventId = `volume-capture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      id: eventId,
      title: text,
      description: `Task created via volume button capture`,
      start_date: tomorrow.toISOString(),
      end_date: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      is_all_day: true,
      category: 'Personal',
      priority: 'Medium',
      recurrence_type: 'None',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      user_id: 'current-user'
    }
  }

  // Schedule reminders for the event
  private async scheduleReminders(event: Event): Promise<void> {
    // Reminder scheduling would be handled separately
    // This is a placeholder for future implementation
    console.log(`Reminder scheduling for ${event.title} would be implemented here`)
  }

  // Show visual feedback
  private showFeedback(message: string, type: 'success' | 'error' | 'listening'): void {
    // Create floating notification
    const notification = document.createElement('div')
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      'bg-blue-500 animate-pulse'
    }`
    notification.textContent = message

    document.body.appendChild(notification)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // Play activation sound
  private playActivationSound(): void {
    if (!this.config.playSoundOnActivation) return

    try {
      // Create a subtle beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.warn('Could not play activation sound:', error)
    }
  }

  // Play activation jingle - UP → DOWN melody
  private playActivationJingle(): void {
    if (!this.config.playActivationJingle) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create UP → DOWN melody: C → A (ascending then descending)
      const notes = [
        { frequency: 523.25, duration: 0.15 }, // C5 (UP)
        { frequency: 440.00, duration: 0.15 }  // A4 (DOWN)
      ]
      
      let currentTime = audioContext.currentTime
      
      notes.forEach((note, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(note.frequency, currentTime)
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.02)
        gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration)
        
        oscillator.start(currentTime)
        oscillator.stop(currentTime + note.duration)
        
        currentTime += note.duration + 0.05 // Small gap between notes
      })
      
      console.log('🎵 Playing UP → DOWN activation jingle')
    } catch (error) {
      console.warn('Could not play activation jingle:', error)
    }
  }

  // Vibrate device
  private vibrateDevice(): void {
    if (!this.config.vibrateOnActivation) return

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]) // Short vibration pattern
    }
  }

  // Setup visibility handlers for background operation
  private setupVisibilityHandlers(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // App is in background - ensure voice capture still works
        this.enableBackgroundMode()
      } else {
        // App is in foreground
        this.disableBackgroundMode()
      }
    })
  }

  private enableBackgroundMode(): void {
    // In a real PWA, this would register a service worker
    // to handle volume button events in the background
    console.log('🎤 Volume button capture enabled for background mode')
  }

  private disableBackgroundMode(): void {
    console.log('🎤 Volume button capture in foreground mode')
  }

  // Public API
  public enable(): void {
    this.config.enabled = true
    console.log('🎤 Volume button voice capture enabled')
  }

  public disable(): void {
    this.config.enabled = false
    if (this.state.recognition && this.state.isListening) {
      this.state.recognition.stop()
    }
    console.log('🎤 Volume button voice capture disabled')
  }

  public updateConfig(newConfig: Partial<VolumeCaptureConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  public addEventListener(callback: (event: Event) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notifyListeners(event: Event): void {
    this.listeners.forEach(listener => listener(event))
  }

  public getStatus(): { enabled: boolean; isListening: boolean; config: VolumeCaptureConfig } {
    return {
      enabled: this.config.enabled,
      isListening: this.state.isListening,
      config: { ...this.config }
    }
  }

  public destroy(): void {
    this.disable()
    if (this.state.recognition) {
      this.state.recognition.abort()
    }
    this.listeners = []
  }
}

// Global instance
let volumeCapture: VolumeButtonCapture | null = null

export function getVolumeCapture(): VolumeButtonCapture {
  if (!volumeCapture) {
    volumeCapture = new VolumeButtonCapture()
  }
  return volumeCapture
}

// React hook for components
export function useVolumeCapture() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    const volumeCapture = getVolumeCapture()
    
    // Get initial status
    const status = volumeCapture.getStatus()
    setIsEnabled(status.enabled)
    setIsListening(status.isListening)

    // Subscribe to changes
    const checkStatus = () => {
      const currentStatus = volumeCapture.getStatus()
      setIsEnabled(currentStatus.enabled)
      setIsListening(currentStatus.isListening)
    }

    const interval = setInterval(checkStatus, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    isEnabled,
    isListening,
    enable: () => getVolumeCapture().enable(),
    disable: () => getVolumeCapture().disable(),
    toggle: () => {
      const capture = getVolumeCapture()
      const status = capture.getStatus()
      if (status.enabled) {
        capture.disable()
      } else {
        capture.enable()
      }
    }
  }
}
