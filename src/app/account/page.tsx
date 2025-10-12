'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    displayName: ''
  })
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          setFormData({
            email: user.email || '',
            displayName: user.user_metadata?.display_name || ''
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: formData.displayName }
      })

      if (error) {
        alert(`Update failed: ${error.message}`)
      } else {
        alert('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      alert('Sign out failed. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Your display name"
                disabled={!isEditing}
              />
            </div>

            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>
              Your current plan and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Plan</h3>
                <p className="text-sm text-muted-foreground">Current subscription</p>
              </div>
              <Badge variant="outline">Free Plan</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">User ID</h3>
                <p className="text-sm text-muted-foreground">Your unique identifier</p>
              </div>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {user.id.slice(0, 8)}...
              </code>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Member Since</h3>
                <p className="text-sm text-muted-foreground">Account creation date</p>
              </div>
              <span className="text-sm">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account and subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild>
                <a href="/billing">Manage Billing</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/pricing">Upgrade Plan</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/settings">App Settings</a>
              </Button>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
