'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Settings,
  X,
  Check,
  AlertCircle,
  Loader,
  Crown,
  Star
} from 'lucide-react'

interface Subscription {
  id: string
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  plan: {
    id: string
    name: string
    amount: number
    interval: 'month' | 'year'
  }
  cancel_at_period_end: boolean
}

interface SubscriptionManagerProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
}

export function SubscriptionManager({ isOpen, onClose, currentPlan }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSubscription()
    }
  }, [isOpen])

  const fetchSubscription = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/subscription', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('remind-auth-token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }

      const data = await response.json()
      setSubscription(data.subscription)
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setError('Failed to load subscription details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('remind-auth-token')}`
        },
        body: JSON.stringify({ subscriptionId: subscription.id })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      await fetchSubscription() // Refresh subscription data
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      setError('Failed to cancel subscription')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!subscription) return

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('remind-auth-token')}`
        },
        body: JSON.stringify({ subscriptionId: subscription.id })
      })

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription')
      }

      await fetchSubscription() // Refresh subscription data
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      setError('Failed to reactivate subscription')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (amount: number, interval: string) => {
    return `$${(amount / 100).toFixed(2)}/${interval}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'unpaid':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Subscription Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your RE:MIND subscription
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Close subscription manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            ) : subscription ? (
              <>
                {/* Current Subscription */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                      Current Subscription
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                        {subscription.plan.name}
                      </h4>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {formatPrice(subscription.plan.amount, subscription.plan.interval)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Current Period:</span>
                        <span className="text-blue-800 dark:text-blue-200 font-medium">
                          {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                        </span>
                      </div>
                      {subscription.cancel_at_period_end && (
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Cancels at period end</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subscription Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Subscription Actions
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscription.cancel_at_period_end ? (
                      <button
                        onClick={handleReactivateSubscription}
                        disabled={isUpdating}
                        className="p-4 border border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-2"
                      >
                        {isUpdating ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Reactivate Subscription
                      </button>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isUpdating}
                        className="p-4 border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                      >
                        {isUpdating ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Cancel Subscription
                      </button>
                    )}

                    <button className="p-4 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      Update Payment Method
                    </button>
                  </div>
                </div>

                {/* Billing History */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Billing History
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Billing history will be displayed here once integrated with Stripe Customer Portal.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Active Subscription
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You're currently on the free plan. Upgrade to unlock premium features!
                </p>
                <button
                  onClick={() => {
                    onClose()
                    // Navigate to pricing page
                    window.location.href = '/pricing'
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  View Pricing Plans
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
