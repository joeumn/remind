'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Mic, MicOff, Sparkles, CheckCircle, X, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface QuickAddReminderProps {
  children?: React.ReactNode
  className?: string
}

export function QuickAddReminder({ children, className }: QuickAddReminderProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [inputText, setInputText] = useState('')
  const [parsedData, setParsedData] = useState<{
    title: string
    due_at: string | null
    notes: string | null
  } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Quick time templates
  const quickTimes = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'Next Week', value: 'next-week' },
    { label: 'In 1 Hour', value: '1-hour' },
    { label: 'In 2 Hours', value: '2-hours' },
  ]

  // Natural language processing simulation
  const parseNaturalLanguage = (text: string) => {
    const lowerText = text.toLowerCase()
    let due_at = null
    let title = text
    let notes = null

    // Extract time patterns
    const timePatterns = [
      { pattern: /tomorrow at (\d{1,2}):?(\d{2})?\s*(am|pm)?/i, handler: (match: RegExpMatchArray) => {
        const hour = parseInt(match[1])
        const minute = match[2] ? parseInt(match[2]) : 0
        const ampm = match[3]?.toLowerCase()
        let hour24 = hour
        if (ampm === 'pm' && hour !== 12) hour24 += 12
        if (ampm === 'am' && hour === 12) hour24 = 0
        
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(hour24, minute, 0, 0)
        return tomorrow.toISOString()
      }},
      { pattern: /today at (\d{1,2}):?(\d{2})?\s*(am|pm)?/i, handler: (match: RegExpMatchArray) => {
        const hour = parseInt(match[1])
        const minute = match[2] ? parseInt(match[2]) : 0
        const ampm = match[3]?.toLowerCase()
        let hour24 = hour
        if (ampm === 'pm' && hour !== 12) hour24 += 12
        if (ampm === 'am' && hour === 12) hour24 = 0
        
        const today = new Date()
        today.setHours(hour24, minute, 0, 0)
        return today.toISOString()
      }},
      { pattern: /next week/i, handler: () => {
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        return nextWeek.toISOString()
      }},
      { pattern: /in (\d+) hour/i, handler: (match: RegExpMatchArray) => {
        const hours = parseInt(match[1])
        const future = new Date()
        future.setHours(future.getHours() + hours)
        return future.toISOString()
      }},
    ]

    for (const { pattern, handler } of timePatterns) {
      const match = text.match(pattern)
      if (match) {
        due_at = handler(match)
        title = text.replace(pattern, '').trim()
        break
      }
    }

    return { title, due_at, notes }
  }

  const handleInputChange = (value: string) => {
    setInputText(value)
    if (value.trim()) {
      const parsed = parseNaturalLanguage(value)
      setParsedData(parsed)
    } else {
      setParsedData(null)
    }
  }

  const handleQuickTime = (timeValue: string) => {
    let due_at = null
    const now = new Date()
    
    switch (timeValue) {
      case 'today':
        due_at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0).toISOString()
        break
      case 'tomorrow':
        due_at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0).toISOString()
        break
      case 'next-week':
        due_at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 9, 0).toISOString()
        break
      case '1-hour':
        due_at = new Date(now.getTime() + 60 * 60 * 1000).toISOString()
        break
      case '2-hours':
        due_at = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()
        break
    }
    
    setParsedData({ title: inputText || 'New reminder', due_at, notes: null })
  }

  const handleSubmit = async () => {
    if (!parsedData?.title.trim()) {
      alert('Please enter a title for your reminder.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/reminders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: parsedData.title.trim(),
          due_at: parsedData.due_at,
          notes: parsedData.notes
        })
      })

      if (response.ok) {
        setShowSuccess(true)
        setInputText('')
        setParsedData(null)
        setTimeout(() => {
          setOpen(false)
          setShowSuccess(false)
          router.refresh()
        }, 1500)
      } else if (response.status === 401) {
        alert('Please sign in to create reminders.')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create reminder.')
      }
    } catch (error) {
      alert('Failed to create reminder. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        handleInputChange(transcript)
      }
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)

      recognition.start()
    } else {
      alert('Voice input not supported in this browser.')
    }
  }

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <>
      {/* Desktop Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button className={cn('btn-primary gap-2', className)}>
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Add Reminder
            </DialogTitle>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Just speak or type: 'Meeting tomorrow at 3pm'"
                      className="input-modern pr-12 text-lg"
                      maxLength={200}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={startVoiceInput}
                      disabled={isListening}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4 text-destructive animate-pulse" />
                      ) : (
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  {/* Quick Time Templates */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Quick times:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickTimes.map((time) => (
                        <Button
                          key={time.value}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickTime(time.value)}
                          className="btn-glass text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {time.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Parsed Preview */}
                {parsedData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="card-modern p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Parsed reminder:
                    </div>
                    <div>
                      <p className="font-semibold">{parsedData.title}</p>
                      {parsedData.due_at && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(parsedData.due_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="btn-glass"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !parsedData?.title.trim()}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Create Reminder
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Reminder Created!</h3>
                <p className="text-muted-foreground">We'll make sure you never miss it.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Mobile Sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            {children || (
              <Button className={cn('btn-primary gap-2', className)}>
                <Plus className="h-4 w-4" />
                Quick Add
              </Button>
            )}
          </SheetTrigger>
          <SheetContent className="h-full">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Add
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Just speak or type naturally..."
                    className="input-modern pr-12 text-lg"
                    maxLength={200}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={startVoiceInput}
                    disabled={isListening}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4 text-destructive animate-pulse" />
                    ) : (
                      <Mic className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {/* Quick Time Templates */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Quick times:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickTimes.map((time) => (
                      <Button
                        key={time.value}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTime(time.value)}
                        className="btn-glass text-xs"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {time.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parsed Preview */}
              {parsedData && (
                <div className="card-modern p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Parsed reminder:
                  </div>
                  <div>
                    <p className="font-semibold">{parsedData.title}</p>
                    {parsedData.due_at && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(parsedData.due_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !parsedData?.title.trim()}
                  className="btn-primary w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Reminder
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="btn-glass w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
