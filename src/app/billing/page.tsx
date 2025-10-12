'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, CreditCard, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BillingPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          // In a real app, you'd fetch subscription data from your database
          setSubscription({
            status: 'free',
            plan: 'Free',
            nextBillingDate: null,
            amount: 0
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

  const handleUpgrade = () => {
    window.location.href = '/pricing'
  }

  const handleManageSubscription = async () => {
    try {
      // In a real app, you'd redirect to Stripe Customer Portal
      alert('Stripe Customer Portal would open here. This feature requires Stripe integration.')
    } catch (error) {
      alert('Failed to open billing portal. Please try again.')
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
              Please sign in to view your billing information
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
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information.
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your active subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{subscription?.plan}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscription?.status === 'free' ? 'Free tier with limited features' : 'Pro features included'}
                </p>
              </div>
              <Badge variant={subscription?.status === 'free' ? 'outline' : 'default'}>
                {subscription?.status === 'free' ? 'Free' : 'Active'}
              </Badge>
            </div>

            {subscription?.status !== 'free' && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Next Billing Date</p>
                  <p className="font-semibold">
                    {subscription?.nextBillingDate 
                      ? new Date(subscription.nextBillingDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">
                    ${subscription?.amount || 0}/month
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              What's included in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 10 reminders</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Basic push notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Voice capture (UP→DOWN)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Cross-device sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">SMS notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Priority support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Upgrade, downgrade, or manage your billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription?.status === 'free' ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unlock unlimited reminders, email & SMS notifications, and priority support.
                  </p>
                  <Button onClick={handleUpgrade} className="w-full">
                    Upgrade to Pro - $9/month
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" onClick={handleManageSubscription} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Payment Method
                </Button>
                <Button variant="outline" onClick={handleManageSubscription} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Billing History
                </Button>
                <Button variant="outline" onClick={handleManageSubscription} className="w-full">
                  Cancel Subscription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Information */}
        {subscription?.status !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Your payment and billing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">•••• •••• •••• 4242</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billing Address</p>
                  <p className="font-semibold">123 Main St, City, State</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleManageSubscription}>
                Update Billing Information
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Questions about billing or subscriptions?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is here to help with any billing questions or issues.
            </p>
            <Button variant="outline" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
