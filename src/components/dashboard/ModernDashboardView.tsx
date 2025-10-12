'use client'

import { useState, useMemo, useCallback } from 'react'
import { useStore } from '@/store'
import { Event } from '@/types'
import { formatDate, isEventToday, isEventUpcoming, sortEventsByPriority } from '@/lib/utils/date'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  CheckSquare, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  Calendar,
  Mic,
  Zap,
  Share2,
  Download,
  Settings,
  TrendingUp,
  Award,
  Star,
  Users,
  Target,
  BarChart3,
  Bell,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  MoreHorizontal
} from 'lucide-react'
import { addDays, subDays } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuickAddReminder } from '@/components/quick-add-reminder'
import { Logo } from '@/components/ui/logo'

export function ModernDashboardView() {
  const { events: rawEvents, tasks, selectedDate, viewMode, setSelectedDate, setViewMode, addEvent } = useStore()
  
  // Deduplicate events to prevent duplicate key errors
  const events = useMemo(() => rawEvents, [rawEvents])
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date')
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('list')

  // Memoized event filtering for better performance
  const todayEvents = useMemo(() => events.filter(isEventToday), [events])
  const upcomingEvents = useMemo(() => 
    events.filter((e) => isEventUpcoming(e, 7) && !isEventToday(e)), [events]
  )
  const urgentEvents = useMemo(() => 
    sortEventsByPriority(events.filter((e) => e.priority === 'Urgent')), [events]
  )

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        case 'priority':
          const priorityOrder = { 'Urgent': 3, 'High': 2, 'Medium': 1, 'Low': 0 }
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [events, searchQuery, sortBy])

  // Memoized handlers to prevent unnecessary re-renders
  const handlePrevDay = useCallback(() => setSelectedDate(subDays(selectedDate, 1)), [selectedDate, setSelectedDate])
  const handleNextDay = useCallback(() => setSelectedDate(addDays(selectedDate, 1)), [selectedDate, setSelectedDate])
  const handleToday = useCallback(() => setSelectedDate(new Date()), [setSelectedDate])

  const handleSaveQuickReminder = async (reminder: Partial<Event>) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      user_id: 'demo-user',
      title: reminder.title ?? 'New reminder',
      category: reminder.category ?? 'Personal',
      priority: reminder.priority ?? 'Medium',
      start_date: reminder.start_date ?? new Date().toISOString(),
      is_all_day: reminder.is_all_day ?? false,
      description: reminder.description ?? '',
      location: reminder.location ?? '',
      end_date: reminder.end_date ?? reminder.start_date ?? new Date().toISOString(),
      recurrence_type: reminder.recurrence_type ?? 'None',
      prep_tasks: reminder.prep_tasks ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    addEvent(newEvent)
    setIsQuickAddOpen(false)
  }

  // Stats for viral-worthy display
  const stats = {
    totalReminders: events.length,
    completedToday: todayEvents.filter(e => e.status === 'completed').length,
    urgentCount: urgentEvents.length,
    thisWeek: upcomingEvents.length,
    streak: 7, // Mock streak
    productivity: 85 // Mock productivity score
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Hero Section with Stats */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="card-modern p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
              </h1>
              <p className="text-muted-foreground">
                {formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Logo size="md" variant="minimal" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Today', value: todayEvents.length, icon: Calendar, color: 'text-primary' },
              { label: 'This Week', value: stats.thisWeek, icon: TrendingUp, color: 'text-success' },
              { label: 'Urgent', value: stats.urgentCount, icon: AlertCircle, color: 'text-destructive' },
              { label: 'Streak', value: `${stats.streak} days`, icon: Award, color: 'text-warning' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-card/50 border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <QuickAddReminder>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </QuickAddReminder>
            <Button variant="outline" className="btn-glass">
              <Mic className="w-4 h-4 mr-2" />
              Voice Input
            </Button>
            <Button variant="outline" className="btn-glass">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="btn-glass">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Navigation and Filters */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay} className="btn-glass">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            onClick={handleToday}
            className="btn-primary px-6"
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextDay} className="btn-glass">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reminders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-10 w-full md:w-64"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-glass"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-modern p-4"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'title')}
                  className="input-modern text-sm"
                >
                  <option value="date">Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View:</span>
                <div className="flex gap-1">
                  <Button
                    variant={viewStyle === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewStyle('list')}
                    className="btn-glass"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewStyle === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewStyle('grid')}
                    className="btn-glass"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Urgent Alerts */}
      {urgentEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-modern p-6 border-destructive/20 bg-destructive/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-destructive">
                ⚠️ Urgent Reminders
              </h3>
              <p className="text-sm text-destructive/80">
                {urgentEvents.length} urgent reminder{urgentEvents.length !== 1 ? 's' : ''} need your attention
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {urgentEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-destructive/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.start_date, 'MMM d, h:mm a')}
                  </p>
                </div>
                <Button size="sm" className="btn-primary">
                  Complete
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Reminders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Reminders
            </h2>
            <span className="text-sm text-muted-foreground">
              {todayEvents.length} reminder{todayEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {todayEvents.length === 0 ? (
            <motion.div
              className="card-modern p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No reminders for today</h3>
              <p className="text-muted-foreground mb-4">You're all caught up! Add a new reminder to stay productive.</p>
              <QuickAddReminder>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </QuickAddReminder>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="card-modern p-4 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        event.priority === 'Urgent' ? 'bg-destructive' :
                        event.priority === 'High' ? 'bg-warning' :
                        event.priority === 'Medium' ? 'bg-primary' : 'bg-muted'
                      }`}></div>
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(event.start_date, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {event.category}
                      </span>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Productivity Score */}
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Productivity Score
            </h3>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${stats.productivity * 2.51} 251`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{stats.productivity}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Great job this week!</p>
            </div>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Coming Up
            </h3>
            <div className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event, index) => (
                <motion.div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    event.priority === 'Urgent' ? 'bg-destructive' :
                    event.priority === 'High' ? 'bg-warning' :
                    event.priority === 'Medium' ? 'bg-primary' : 'bg-muted'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.start_date, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </motion.div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming reminders
                </p>
              )}
            </div>
          </motion.div>

          {/* Achievement Badge */}
          <motion.div
            className="card-gradient p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Achievement Unlocked!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've completed {stats.completedToday} reminders today. Keep it up!
            </p>
            <Button size="sm" className="btn-primary">
              <Share2 className="w-4 h-4 mr-2" />
              Share Achievement
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating Quick Add Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      >
        <QuickAddReminder>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full gradient-primary shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </QuickAddReminder>
      </motion.div>
    </div>
  )
}