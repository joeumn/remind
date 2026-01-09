'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ArrowRight, Mic, MicOff, Sparkles, Clock, Calendar, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [transcript, setTranscript] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    due_at: '',
    notes: ''
  })
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsRecording(true)
        setTranscript('')
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        setFormData(prev => ({ ...prev, title: transcript }))
        setIsRecording(false)
      }
      
      recognition.onerror = () => {
        setIsRecording(false)
      }
      
      setRecognition(recognition)
    }
  }, [])

  const startRecording = () => {
    if (recognition) {
      recognition.start()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
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
          title: formData.title.trim(),
          due_at: formData.due_at || null,
          notes: formData.notes.trim() || null
        })
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setFormData({ title: '', due_at: '', notes: '' })
          setSuccess(false)
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const quickSuggestions = [
    "Call mom at 3 PM",
    "Team meeting tomorrow",
    "Buy groceries this weekend",
    "Doctor appointment next week"
  ]

  const handleQuickSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, title: suggestion }))
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <>
      {/* Desktop Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button className={cn('gap-2 gradient-primary hover:opacity-90 hover-lift shadow-glow', className)}>
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg glass-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient">Create Reminder</DialogTitle>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Reminder Created!</h3>
                <p className="text-muted-foreground">Your reminder has been saved successfully.</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Voice Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant={isRecording ? "destructive" : "outline"}
                      size="icon"
                      onClick={startRecording}
                      disabled={isRecording || !recognition}
                      className={cn(
                        "transition-all duration-200",
                        isRecording && "animate-pulse-glow"
                      )}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1">
                      <Label htmlFor="title" className="text-sm font-medium">
                        {isRecording ? "Listening..." : "What do you need to remember?"}
                      </Label>
                      {isRecording && (
                        <motion.div
                          className="flex items-center gap-2 mt-1"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <Input
                    ref={inputRef}
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Type or speak your reminder..."
                    maxLength={140}
                    required
                    className="text-lg py-3"
                    autoFocus
                  />
                  
                  {/* Quick Suggestions */}
                  {!formData.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <p className="text-sm text-muted-foreground">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickSuggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            type="button"
                            onClick={() => handleQuickSuggestion(suggestion)}
                            className="px-3 py-1.5 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_at" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </Label>
                    <Input
                      id="due_at"
                      type="date"
                      value={formData.due_at.split('T')[0] || ''}
                      onChange={(e) => handleInputChange('due_at', e.target.value + (formData.due_at.includes('T') ? 'T' + formData.due_at.split('T')[1] : ''))}
                      className="py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.due_at.split('T')[1] || ''}
                      onChange={(e) => handleInputChange('due_at', (formData.due_at.split('T')[0] || new Date().toISOString().split('T')[0]) + 'T' + e.target.value)}
                      className="py-3"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional details..."
                    maxLength={2000}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !formData.title.trim()}
                    className="px-6 gradient-primary hover:opacity-90 hover-lift shadow-glow"
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="h-4 w-4" />
                        Creating...
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Create Reminder
                      </div>
                    )}
                  </Button>
                </div>
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
              <Button className={cn('gap-2 gradient-primary hover:opacity-90', className)}>
                <Plus className="h-4 w-4" />
                Quick Add
              </Button>
            )}
          </SheetTrigger>
          <SheetContent className="glass-strong border-border/50">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-gradient">Create Reminder</SheetTitle>
            </SheetHeader>
            
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Reminder Created!</h3>
                  <p className="text-muted-foreground">Your reminder has been saved successfully.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 mt-6"
                >
                  {/* Voice Input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        onClick={startRecording}
                        disabled={isRecording || !recognition}
                        className={cn(
                          "transition-all duration-200",
                          isRecording && "animate-pulse-glow"
                        )}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1">
                        <Label htmlFor="mobile-title" className="text-sm font-medium">
                          {isRecording ? "Listening..." : "What do you need to remember?"}
                        </Label>
                      </div>
                    </div>
                    
                    <Input
                      id="mobile-title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Type or speak your reminder..."
                      maxLength={140}
                      required
                      className="text-lg py-3"
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile-due_at" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date & Time
                      </Label>
                      <Input
                        id="mobile-due_at"
                        type="datetime-local"
                        value={formData.due_at}
                        onChange={(e) => handleInputChange('due_at', e.target.value)}
                        className="py-3"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile-notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="mobile-notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any additional details..."
                      maxLength={2000}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isLoading || !formData.title.trim()}
                      className="w-full gradient-primary hover:opacity-90 hover-lift shadow-glow"
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center gap-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Sparkles className="h-4 w-4" />
                          Creating...
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Create Reminder
                        </div>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
