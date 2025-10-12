'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'minimal' | 'text'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-16 h-16 text-3xl',
  xl: 'w-24 h-24 text-5xl',
}

export function Logo({ size = 'md', variant = 'default', className }: LogoProps) {
  if (variant === 'text') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('font-display font-bold gradient-primary bg-clip-text text-transparent', sizeClasses[size])}>
          RE:MIND
        </div>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('relative', sizeClasses[size])}>
        <div className="w-full h-full rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <span className="font-display font-bold text-primary-foreground">R</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Main Logo Container */}
      <div className="w-full h-full rounded-2xl gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
        {/* R Letter */}
        <div className="relative">
          <span className="font-display font-bold text-primary-foreground text-2xl">R</span>
          {/* Colon */}
          <div className="absolute -right-1 top-0 w-1 h-1 bg-primary-foreground rounded-full animate-bounce-gentle"></div>
          <div className="absolute -right-1 top-3 w-1 h-1 bg-primary-foreground rounded-full animate-bounce-gentle" style={{ animationDelay: '0.1s' }}></div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-float"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-success rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  )
}

export function LogoText({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Logo size="sm" variant="minimal" />
      <div className="font-display font-bold text-2xl gradient-primary bg-clip-text text-transparent">
        RE:MIND
      </div>
    </div>
  )
}