'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    
    const updateActualTheme = () => {
      let newActualTheme: 'light' | 'dark'
      
      if (theme === 'system') {
        newActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        newActualTheme = theme
      }
      
      setActualTheme(newActualTheme)
      
      // Update HTML class and CSS variables
      root.classList.remove('light', 'dark')
      root.classList.add(newActualTheme)
      
      // Update CSS custom properties
      if (newActualTheme === 'dark') {
        root.style.setProperty('--bg-primary', '#0f172a')
        root.style.setProperty('--bg-secondary', '#1e293b')
        root.style.setProperty('--bg-tertiary', '#334155')
        root.style.setProperty('--text-primary', '#f8fafc')
        root.style.setProperty('--text-secondary', '#cbd5e1')
        root.style.setProperty('--text-tertiary', '#94a3b8')
        root.style.setProperty('--border-primary', '#334155')
        root.style.setProperty('--border-secondary', '#475569')
      } else {
        root.style.setProperty('--bg-primary', '#ffffff')
        root.style.setProperty('--bg-secondary', '#f8fafc')
        root.style.setProperty('--bg-tertiary', '#f1f5f9')
        root.style.setProperty('--text-primary', '#0f172a')
        root.style.setProperty('--text-secondary', '#475569')
        root.style.setProperty('--text-tertiary', '#64748b')
        root.style.setProperty('--border-primary', '#e2e8f0')
        root.style.setProperty('--border-secondary', '#cbd5e1')
      }
    }

    updateActualTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateActualTheme)

    return () => mediaQuery.removeEventListener('change', updateActualTheme)
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
