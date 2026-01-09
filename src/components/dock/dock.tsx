'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Mic, MicOff, ExternalLink, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { VoiceProcessor } from '@/lib/voice/voiceProcessor'
import { QuickAddReminder } from '@/components/quick-add-reminder'

interface DockProps {
  alwaysListening?: boolean
  onToggleListening?: () => void
  onQuickAdd?: () => void
  onOpenApp?: () => void
}

export function Dock({ 
  alwaysListening = false, 
  onToggleListening, 
  onQuickAdd, 
  onOpenApp 
}: DockProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false)
  const [voiceProcessor] = useState(() => VoiceProcessor.getInstance())
  const dockRef = useRef<HTMLDivElement>(null)

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('remind-dock-position')
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition)
        // Ensure dock is within viewport bounds
        const maxX = window.innerWidth - 200 // Dock width estimate
        const maxY = window.innerHeight - 100 // Dock height estimate
        setPosition({
          x: Math.min(Math.max(x, 0), maxX),
          y: Math.min(Math.max(y, 0), maxY)
        })
      } catch (error) {
        console.warn('Failed to load dock position:', error)
        // Default position for mobile vs desktop
        const isMobile = window.innerWidth < 768
        setPosition({
          x: isMobile ? 20 : 50,
          y: isMobile ? window.innerHeight - 80 : 50
        })
      }
    } else {
      // Default position for mobile vs desktop
      const isMobile = window.innerWidth < 768
      setPosition({
        x: isMobile ? 20 : 50,
        y: isMobile ? window.innerHeight - 80 : 50
      })
    }
  }, [])

  // Save position to localStorage
  const savePosition = (newPosition: { x: number; y: number }) => {
    localStorage.setItem('remind-dock-position', JSON.stringify(newPosition))
  }

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100
      const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100
      
      const clampedPosition = {
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      }
      
      setPosition(clampedPosition)
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      savePosition(position)
    }
  }

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // Focus management for keyboard users
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // Respect reduced motion preference
  const shouldAnimate = typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleVoiceCapture = () => {
    if (isVoiceProcessing) return

    setIsVoiceProcessing(true)
    voiceProcessor.startListening(
      async (result) => {
        try {
          const response = await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
          })

          if (response.ok) {
            // Show success feedback
            console.log('Reminder created from voice:', result)
            // You could add a toast notification here
          } else {
            console.error('Failed to create reminder')
          }
        } catch (error) {
          console.error('Error creating reminder:', error)
        } finally {
          setIsVoiceProcessing(false)
        }
      },
      (error) => {
        console.error('Voice recognition error:', error)
        setIsVoiceProcessing(false)
      }
    )
  }

  return (
    <div
      ref={dockRef}
      className={cn(
        'fixed z-40 select-none',
        shouldAnimate && 'transition-transform duration-200 ease-out'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="RE:MIND Dock - Drag to move, use buttons for actions"
    >
      <div className="flex items-center space-x-2 bg-background/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
        <QuickAddReminder>
          <Button
            size="icon"
            className="h-8 w-8"
            aria-label="Quick Add Reminder"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </QuickAddReminder>
        
        <Button
          size="icon"
          variant="outline"
          onClick={handleVoiceCapture}
          disabled={isVoiceProcessing}
          className={cn(
            'h-8 w-8',
            isVoiceProcessing 
              ? 'text-blue-600 border-blue-600' 
              : 'text-muted-foreground'
          )}
          aria-label="Voice Capture"
        >
          {isVoiceProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        
        {onToggleListening && (
          <Button
            size="icon"
            variant="outline"
            onClick={onToggleListening}
            className={cn(
              'h-8 w-8',
              alwaysListening 
                ? 'text-green-600 border-green-600' 
                : 'text-muted-foreground'
            )}
            aria-label={alwaysListening ? 'Disable Always Listening' : 'Enable Always Listening'}
          >
            {alwaysListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          size="icon"
          variant="outline"
          onClick={onOpenApp}
          className="h-8 w-8"
          aria-label="Open RE:MIND App"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
