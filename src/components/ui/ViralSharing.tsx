'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Download, 
  Twitter, 
  Instagram, 
  Facebook, 
  Copy, 
  CheckCircle,
  Sparkles,
  Trophy,
  Zap,
  Target,
  Brain,
  Clock,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'

interface ViralSharingProps {
  isOpen: boolean
  onClose: () => void
  userStats?: {
    totalReminders: number
    completedToday: number
    streak: number
    aiSuggestions: number
  }
}

export function ViralSharing({ isOpen, onClose, userStats = {
  totalReminders: 47,
  completedToday: 8,
  streak: 12,
  aiSuggestions: 23
} }: ViralSharingProps) {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'social'>('screenshot')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateScreenshot = async () => {
    setIsGenerating(true)
    
    // Simulate screenshot generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would generate an actual screenshot
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Create a beautiful screenshot
        const gradient = ctx.createLinearGradient(0, 0, 400, 400)
        gradient.addColorStop(0, '#1e1b4b')
        gradient.addColorStop(1, '#312e81')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 400, 400)
        
        // Add text
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 24px Inter'
        ctx.fillText('RE:MIND Dashboard', 20, 40)
        
        ctx.font = '16px Inter'
        ctx.fillText(`Streak: ${userStats.streak} days`, 20, 80)
        ctx.fillText(`Completed Today: ${userStats.completedToday}`, 20, 110)
        ctx.fillText(`AI Suggestions: ${userStats.aiSuggestions}`, 20, 140)
      }
    }
    
    setIsGenerating(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareTexts = {
    twitter: `🚀 Just hit a ${userStats.streak}-day productivity streak with RE:MIND! Never missing another important reminder again. #Productivity #REMINDApp`,
    instagram: `✨ My productivity game is on fire! ${userStats.streak} days strong with RE:MIND - the AI-powered reminder app that actually works. Who else is crushing their goals? 💪 #ProductivityGoals #REMINDApp`,
    facebook: `I've been using RE:MIND for a few weeks now and I'm absolutely loving it! The AI-powered voice reminders and smart scheduling have completely transformed how I stay organized. ${userStats.streak} days of perfect productivity!`,
    general: `Check out my productivity streak with RE:MIND! ${userStats.streak} days of never missing an important reminder. The AI-powered voice recognition and smart scheduling make staying organized effortless.`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl glass-strong rounded-3xl p-8"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gradient">Share Your Progress</h2>
              <p className="text-muted-foreground">Show off your productivity streak!</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <Button
              variant={activeTab === 'screenshot' ? 'default' : 'outline'}
              onClick={() => setActiveTab('screenshot')}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Screenshot
            </Button>
            <Button
              variant={activeTab === 'social' ? 'default' : 'outline'}
              onClick={() => setActiveTab('social')}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Social Share
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'screenshot' ? (
              <motion.div
                key="screenshot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Preview */}
                <div className="glass rounded-2xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Your Achievement Screenshot</h3>
                  
                  {/* Mock Screenshot */}
                  <div className="bg-gradient-to-br from-background to-muted/20 rounded-xl p-6 mx-auto max-w-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Logo size="sm" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">Streak</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient">{userStats.streak} days</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-accent" />
                          <span className="font-medium">Today</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient">{userStats.completedToday}/12</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">AI Help</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient">{userStats.aiSuggestions}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      Generated with RE:MIND
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateScreenshot}
                    disabled={isGenerating}
                    className="flex-1 gradient-primary hover:opacity-90"
                  >
                    {isGenerating ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="h-4 w-4" />
                        Generating...
                      </motion.div>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Screenshot
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="glass hover:glass-strong">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Image
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Social Platforms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 glass hover:glass-strong"
                    onClick={() => copyToClipboard(shareTexts.twitter)}
                  >
                    <Twitter className="h-6 w-6 text-blue-400" />
                    <span className="text-sm font-medium">Twitter</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 glass hover:glass-strong"
                    onClick={() => copyToClipboard(shareTexts.instagram)}
                  >
                    <Instagram className="h-6 w-6 text-pink-500" />
                    <span className="text-sm font-medium">Instagram</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 glass hover:glass-strong"
                    onClick={() => copyToClipboard(shareTexts.facebook)}
                  >
                    <Facebook className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Facebook</span>
                  </Button>
                </div>

                {/* Custom Message */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customize Your Message</h3>
                  <textarea
                    className="w-full p-4 glass rounded-xl resize-none"
                    rows={4}
                    defaultValue={shareTexts.general}
                    placeholder="Write your own message..."
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => copyToClipboard(shareTexts.general)}
                      className="flex-1 gradient-primary hover:opacity-90"
                    >
                      {copied ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Copied!
                        </motion.div>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Text
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="glass hover:glass-strong">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="glass rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Your Achievement Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>{userStats.streak} day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      <span>{userStats.completedToday} completed today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span>{userStats.aiSuggestions} AI suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>Productivity master</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden canvas for screenshot generation */}
          <canvas ref={canvasRef} className="hidden" width={400} height={400} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
