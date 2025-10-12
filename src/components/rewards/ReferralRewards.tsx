'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gift, 
  Users, 
  DollarSign, 
  Share2, 
  Copy, 
  CheckCircle,
  X,
  Star,
  Trophy,
  CreditCard,
  Crown
} from 'lucide-react'

interface ReferralRewardsProps {
  isOpen: boolean
  onClose: () => void
  isProUser: boolean
}

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  pendingEarnings: number
}

export function ReferralRewards({ isOpen, onClose, isProUser }: ReferralRewardsProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Mock data - in real app, fetch from API
  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    successfulReferrals: 8,
    totalEarnings: 40.00,
    pendingEarnings: 20.00
  })

  const referralCode = 'REMINDAI2024'
  const referralLink = `https://remind.app/join/${referralCode}`
  const earningsPerReferral = 5.00

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RE:MIND - Never Forget Anything Again',
          text: 'Join me on RE:MIND - the AI-powered reminder app that makes it impossible to forget anything!',
          url: referralLink
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      handleCopyLink()
    }
  }

  const rewardTiers = [
    {
      referrals: 5,
      reward: '$25',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      referrals: 10,
      reward: '$50',
      icon: Trophy,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      referrals: 25,
      reward: '$150',
      icon: Gift,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      referrals: 50,
      reward: '$300',
      icon: Crown,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ]

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
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Referral Rewards
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Earn $5 for every friend who joins RE:MIND!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Close rewards"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalReferrals}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Referrals
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.successfulReferrals}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Successful
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${stats.totalEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  Earned
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                <CreditCard className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ${stats.pendingEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Pending
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                How Referral Rewards Work
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Share Your Code</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Share your unique referral code or link with friends
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Friend Joins</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your friend signs up using your code and becomes a Pro user
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Earn $5</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You receive $5 credit or cash reward when they upgrade to Pro
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code & Link */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Referral Tools
              </h3>
              
              {/* Referral Code */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Referral Code
                    </h4>
                    <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {referralCode}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      copiedCode 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Referral Link
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {referralLink}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        copiedCode 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 hover:bg-gray-600 text-white'
                      }`}
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reward Tiers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Bonus Reward Tiers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewardTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-xl ${tier.bgColor} ${tier.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <tier.icon className={`w-6 h-6 ${tier.color}`} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {tier.referrals} Referrals
                        </h4>
                        <div className={`text-lg font-bold ${tier.color}`}>
                          +{tier.reward} Bonus
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Earn extra rewards when you hit referral milestones!
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Benefits Reminder */}
            {!isProUser && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Pro Users Earn More!
                  </h3>
                </div>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Pro users get double rewards and exclusive referral bonuses. 
                  Upgrade to Pro to unlock the full earning potential!
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
