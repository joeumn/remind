'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Settings, User, Menu, X, Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MainNavProps {
  alwaysListening?: boolean
  onToggleListening?: () => void
}

export function MainNav({ alwaysListening = false, onToggleListening }: MainNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Settings', href: '/settings' },
    { name: 'Account', href: '/account' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary"></div>
            <span className="hidden font-bold sm:inline-block">RE:MIND</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
              <div className="h-6 w-6 rounded bg-primary"></div>
              <span className="font-bold">RE:MIND</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            {onToggleListening && (
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleListening}
                className={cn(
                  alwaysListening ? 'text-green-600 border-green-600' : 'text-muted-foreground'
                )}
                aria-label={alwaysListening ? 'Disable always listening' : 'Enable always listening'}
              >
                {alwaysListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </nav>
        </div>
        {isMobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-foreground/80',
                      pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
