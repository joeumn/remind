'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface QuickAddReminderProps {
  children?: React.ReactNode
  className?: string
}

export function QuickAddReminder({ children, className }: QuickAddReminderProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    due_at: '',
    notes: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
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
          title: formData.title.trim(),
          due_at: formData.due_at || null,
          notes: formData.notes.trim() || null
        })
      })

      if (response.ok) {
        alert('Reminder created successfully!')
        setOpen(false)
        setFormData({ title: '', due_at: '', notes: '' })
        router.refresh()
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

  return (
    <>
      {/* Desktop Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button className={cn('gap-2', className)}>
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Add Reminder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="What do you need to remember?"
                maxLength={140}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_at">Due Date & Time (Optional)</Label>
              <Input
                id="due_at"
                type="datetime-local"
                value={formData.due_at}
                onChange={(e) => handleInputChange('due_at', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional details..."
                maxLength={2000}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Reminder'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mobile Sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            {children || (
              <Button className={cn('gap-2', className)}>
                <Plus className="h-4 w-4" />
                Quick Add
              </Button>
            )}
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Quick Add Reminder</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="mobile-title">Title *</Label>
                <Input
                  id="mobile-title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="What do you need to remember?"
                  maxLength={140}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-due_at">Due Date & Time (Optional)</Label>
                <Input
                  id="mobile-due_at"
                  type="datetime-local"
                  value={formData.due_at}
                  onChange={(e) => handleInputChange('due_at', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-notes">Notes (Optional)</Label>
                <Textarea
                  id="mobile-notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional details..."
                  maxLength={2000}
                  rows={3}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Creating...' : 'Create Reminder'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
