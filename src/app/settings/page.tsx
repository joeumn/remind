'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor, Mic, MicOff } from 'lucide-react'

export default function Settings() {
  const [alwaysListening, setAlwaysListening] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Load always listening preference
    const saved = localStorage.getItem('remind-always-listening')
    if (saved === 'true') {
      setAlwaysListening(true)
    }
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    alert(`Switched to ${newTheme} theme.`)
  }

  const handleAlwaysListeningChange = (enabled: boolean) => {
    setAlwaysListening(enabled)
    localStorage.setItem('remind-always-listening', enabled.toString())
    alert(enabled 
      ? 'Always Listening is now enabled.' 
      : 'Always Listening is now disabled.')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your RE:MIND preferences and account settings.
          </p>
        </div>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how RE:MIND looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('system')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Always Listening Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Features</CardTitle>
            <CardDescription>
              Configure voice capture and always listening
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="always-listening">Always Listening</Label>
                <p className="text-sm text-muted-foreground">
                  Enable continuous voice capture with UP→DOWN sequence
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={alwaysListening ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAlwaysListeningChange(!alwaysListening)}
                >
                  {alwaysListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {alwaysListening && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Always Listening is active. Press Volume UP then DOWN to capture voice reminders.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account and subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">
                  user@example.com
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Subscription</Label>
                <p className="text-sm text-muted-foreground">
                  Free Plan
                </p>
              </div>
              <Button variant="outline" size="sm">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your device
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders via email
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}