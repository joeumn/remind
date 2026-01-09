'use client'

import { Menu, Bell, Settings, User } from 'lucide-react'
import { useStore } from '@/store'
import { LogoCompact } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function Header() {
  const notifications = useStore((state) => state.notifications)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <motion.header 
      className="sticky top-0 z-40 glass border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            title="Open menu"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <LogoCompact />
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span 
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-destructive rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
