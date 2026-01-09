'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Mic, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Star, 
  Trophy, 
  Zap, 
  Target,
  TrendingUp,
  Share2,
  Download,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ViralDashboardProps {
  onQuickAdd: () => void
}

export function ViralDashboard({ onQuickAdd }: ViralDashboardProps) {
  const [mounted, setMounted] = useState(false)
  const [todayCount, setTodayCount] = useState(0)
  const [weekStreak, setWeekStreak] = useState(7)
  const [completedToday, setCompletedToday] = useState(3)

  useEffect(() => {
    setMounted(true)
    // Animate counters on mount
    const timer = setTimeout(() => {
      setTodayCount(5)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const achievements = [
    { icon: <Trophy className="h-5 w-5" />, title: "Week Warrior", description: "7 day streak!", unlocked: true },
    { icon: <Target className="h-5 w-5" />, title: "Perfect Day", description: "All reminders completed", unlocked: true },
    { icon: <Zap className="h-5 w-5" />, title: "Speed Demon", description: "10 quick adds in a row", unlocked: false },
    { icon: <Star className="h-5 w-5" />, title: "Consistency King", description: "30 day streak", unlocked: false }
  ]

  const todayReminders = [
    { id: 1, title: "Team standup meeting", time: "9:00 AM", completed: true, priority: "high" },
    { id: 2, title: "Call mom for her birthday", time: "2:00 PM", completed: true, priority: "high" },
    { id: 3, title: "Review quarterly reports", time: "4:00 PM", completed: true, priority: "medium" },
    { id: 4, title: "Grocery shopping", time: "6:00 PM", completed: false, priority: "low" },
    { id: 5, title: "Gym workout", time: "7:30 PM", completed: false, priority: "medium" }
  ]

  const stats = [
    { label: "Today", value: todayCount, icon: <Calendar className="h-5 w-5" />, color: "text-blue-500" },
    { label: "Completed", value: completedToday, icon: <CheckCircle className="h-5 w-5" />, color: "text-green-500" },
    { label: "Streak", value: weekStreak, icon: <TrendingUp className="h-5 w-5" />, color: "text-purple-500" },
    { label: "Score", value: 2847, icon: <Star className="h-5 w-5" />, color: "text-yellow-500" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 space-y-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Header Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass rounded-2xl p-6 hover-lift"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("p-2 rounded-lg bg-muted/50", stat.color)}>
                {stat.icon}
              </div>
              <div>
                <motion.div 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Button
          onClick={onQuickAdd}
          className="gap-3 px-8 py-4 text-lg font-semibold gradient-primary hover:opacity-90 hover-lift shadow-glow"
          size="lg"
        >
          <Mic className="h-5 w-5" />
          Voice Capture
          <Sparkles className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          className="gap-3 px-6 py-4 glass hover:glass-strong hover-lift"
          size="lg"
        >
          <Share2 className="h-5 w-5" />
          Share Progress
        </Button>
      </motion.div>

      {/* Today's Reminders */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Today's Focus
          </h2>
          <div className="text-sm text-muted-foreground">
            {completedToday}/{todayReminders.length} completed
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {todayReminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                className={cn(
                  "glass rounded-xl p-4 hover-lift transition-all",
                  reminder.completed && "opacity-60"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      reminder.completed 
                        ? "bg-green-500 border-green-500" 
                        : "border-muted-foreground"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {reminder.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium",
                      reminder.completed && "line-through"
                    )}>
                      {reminder.title}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {reminder.time}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    reminder.priority === "high" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                    reminder.priority === "medium" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                    reminder.priority === "low" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  )}>
                    {reminder.priority}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className={cn(
                "glass rounded-xl p-4 hover-lift transition-all",
                achievement.unlocked 
                  ? "border-yellow-500/30 bg-yellow-500/5" 
                  : "opacity-50"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: achievement.unlocked ? 1 : 0.5, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={achievement.unlocked ? { scale: 1.02 } : undefined}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  achievement.unlocked 
                    ? "bg-yellow-500/20 text-yellow-500" 
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  {achievement.icon}
                </div>
                <div>
                  <div className="font-semibold">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <motion.div
                    className="ml-auto"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
                  >
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, delay: 1 }}
      >
        <Button
          onClick={onQuickAdd}
          className="w-14 h-14 rounded-full gradient-primary hover:opacity-90 hover-lift shadow-glow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  )
}