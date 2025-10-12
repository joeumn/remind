'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

export function Logo({ size = 'md', className, animated = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <motion.div 
      className={cn('flex items-center gap-3', className)}
      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      {/* Logo Icon */}
      <motion.div 
        className="relative"
        animate={animated ? { rotate: [0, 5, -5, 0] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={cn(
          'relative rounded-2xl gradient-primary p-3 shadow-glow',
          size === 'sm' && 'p-2 rounded-lg',
          size === 'xl' && 'p-4 rounded-3xl'
        )}>
          <Zap className={cn('text-white', iconSizes[size])} />
          
          {/* Floating particles */}
          {animated && (
            <>
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-secondary rounded-full"
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 1.2
                }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <motion.h1 
          className={cn(
            'font-bold tracking-tight text-gradient leading-none',
            sizeClasses[size]
          )}
          initial={animated ? { opacity: 0, x: -20 } : undefined}
          animate={animated ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          RE:MIND
        </motion.h1>
        {size !== 'sm' && (
          <motion.p 
            className={cn(
              'text-muted-foreground font-medium leading-none',
              size === 'xl' ? 'text-lg' : 'text-xs'
            )}
            initial={animated ? { opacity: 0, x: -20 } : undefined}
            animate={animated ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Never Forget Again
          </motion.p>
        )}
      </div>

      {/* Sparkle effect */}
      {animated && size !== 'sm' && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-4 w-4 text-accent" />
        </motion.div>
      )}
    </motion.div>
  )
}

export function LogoCompact({ className }: { className?: string }) {
  return (
    <motion.div 
      className={cn('flex items-center gap-2', className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-lg gradient-primary p-1.5 shadow-glow">
          <Zap className="h-full w-full text-white" />
        </div>
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full"
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity
          }}
        />
      </div>
      <span className="font-bold text-lg text-gradient">RE:MIND</span>
    </motion.div>
  )
}