'use client'

import { Menu, Bell, Settings, User } from 'lucide-react'
import { useStore } from '@/store'
import { LogoText } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function Header() {
  const notifications = useStore((state) => state.notifications)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/50 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            title="Open menu"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <LogoText className="text-xl" />
        </div>
        
        {/* Center Section - Status Indicator */}
        <motion.div 
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-success">All systems operational</span>
        </motion.div>
        
        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span 
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-destructive rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
