'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Star,
  Share2,
  Download,
  Trophy,
  Target,
  Brain,
  Globe,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'

interface ViralDashboardProps {
  reminders?: any[]
  onQuickAdd?: () => void
}

export function ViralDashboard({ reminders = [], onQuickAdd }: ViralDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Reminder", description: "Created your first reminder", unlocked: true, icon: <CheckCircle className="h-6 w-6" /> },
    { id: 2, title: "Voice Master", description: "Used voice input 10 times", unlocked: true, icon: <Mic className="h-6 w-6" /> },
    { id: 3, title: "Productivity Pro", description: "Completed 50 reminders", unlocked: false, icon: <Trophy className="h-6 w-6" /> },
    { id: 4, title: "AI Assistant", description: "Let AI categorize 25 reminders", unlocked: true, icon: <Brain className="h-6 w-6" /> }
  ])

  const [stats, setStats] = useState({
    totalReminders: 47,
    completedToday: 8,
    streak: 12,
    aiSuggestions: 23
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    })
  }

  const sampleReminders = [
    { id: 1, title: "Team standup at 9 AM", time: "9:00 AM", priority: "high", category: "work", completed: false },
    { id: 2, title: "Call mom for her birthday", time: "7:00 PM", priority: "medium", category: "personal", completed: false },
    { id: 3, title: "Grocery shopping", time: "2:00 PM", priority: "low", category: "shopping", completed: true },
    { id: 4, title: "Doctor appointment", time: "10:30 AM", priority: "high", category: "health", completed: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <Logo size="lg" />
            <p className="text-muted-foreground mt-2">Your productivity command center</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onQuickAdd}
              className="gradient-primary hover:opacity-90 hover-lift shadow-glow"
            >
              <Mic className="h-4 w-4 mr-2" />
              Voice Add
            </Button>
            <Button variant="outline" className="glass hover:glass-strong">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Time and Stats Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Current Time */}
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Current Time</span>
            </div>
            <div className="text-3xl font-bold text-gradient">{formatTime(currentTime)}</div>
            <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
          </div>

          {/* Today's Progress */}
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-6 w-6 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Today's Progress</span>
            </div>
            <div className="text-3xl font-bold text-gradient">{stats.completedToday}/12</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <motion.div 
                className="bg-gradient-accent h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.completedToday / 12) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">Streak</span>
            </div>
            <div className="text-3xl font-bold text-gradient">{stats.streak} days</div>
            <div className="text-sm text-muted-foreground">Keep it up! 🔥</div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">AI Insights</span>
            </div>
            <div className="text-3xl font-bold text-gradient">{stats.aiSuggestions}</div>
            <div className="text-sm text-muted-foreground">Smart suggestions</div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reminders List */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gradient">Today's Reminders</h2>
              <Button variant="outline" size="sm" className="glass">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {sampleReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  className="glass rounded-xl p-4 hover-lift group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        reminder.priority === 'high' ? 'bg-destructive' :
                        reminder.priority === 'medium' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <div>
                        <p className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {reminder.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {reminder.time}
                          <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                            {reminder.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {reminder.completed ? (
                        <CheckCircle className="h-5 w-5 text-accent" />
                      ) : (
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Achievements */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.unlocked ? 'bg-accent/10 border border-accent/20' : 'bg-muted/30'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={onQuickAdd}
                  className="w-full gradient-primary hover:opacity-90 hover-lift"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Reminder
                </Button>
                <Button variant="outline" className="w-full glass hover:glass-strong">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Suggestions
                </Button>
                <Button variant="outline" className="w-full glass hover:glass-strong">
                  <Globe className="h-4 w-4 mr-2" />
                  Sync Devices
                </Button>
              </div>
            </div>

            {/* Share Your Progress */}
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Share Your Progress
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Show off your productivity streak and inspire others!
              </p>
              <div className="space-y-2">
                <Button className="w-full gradient-primary hover:opacity-90">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Screenshot
                </Button>
                <Button variant="outline" className="w-full glass hover:glass-strong">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share to Social
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 1 }}
        >
          <Button
            onClick={onQuickAdd}
            className="w-16 h-16 rounded-full gradient-primary hover:opacity-90 hover-lift shadow-glow"
            size="icon"
          >
            <Mic className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
