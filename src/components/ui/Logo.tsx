'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
}

export function Logo({ size = 'md', animated = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated Logo Icon */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={animated ? {
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Main Circle */}
        <div className="w-full h-full rounded-full gradient-primary relative overflow-hidden">
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
          
          {/* Floating particles */}
          {animated && (
            <>
              <motion.div
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{ top: '20%', left: '30%' }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{ top: '70%', right: '25%' }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1
                }}
              />
            </>
          )}
        </div>
        
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-slow" />
      </motion.div>
      
      {/* Logo Text */}
      <motion.div
        className={`font-bold ${textSizes[size]} text-gradient`}
        animate={animated ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      >
        RE:MIND
      </motion.div>
    </div>
  )
}

// Compact version for headers
export function LogoCompact({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="w-8 h-8 rounded-full gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
      </div>
      <span className="font-bold text-xl text-gradient">RE:MIND</span>
    </motion.div>
  )
}