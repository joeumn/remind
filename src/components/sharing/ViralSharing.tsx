'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, 
  Copy, 
  QrCode, 
  Gift, 
  Users, 
  Star,
  Twitter,
  Facebook,
  MessageSquare,
  Mail,
  Check,
  X
} from 'lucide-react'

interface ViralSharingProps {
  isOpen: boolean
  onClose: () => void
}

export function ViralSharing({ isOpen, onClose }: ViralSharingProps) {
  const [copied, setCopied] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  // Mock user data - in real app, this would come from user profile
  const userReferralCode = 'REMINDS-JOHN-2024'
  const referralLink = `https://remind.app/invite/${userReferralCode}`
  const shareText = "Just discovered RE:MIND - the fastest, simplest reminder app ever! Never miss another important moment. Try it free:"
  
  const sharingMethods = [
    {
      id: 'copy',
      name: 'Copy Link',
      icon: Copy,
      color: 'bg-gray-600',
      description: 'Share anywhere'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      description: 'Tweet about it'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      description: 'Post to friends'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-500',
      description: 'Send to contacts'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500',
      description: 'Email invitation'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCode,
      color: 'bg-purple-600',
      description: 'Show & scan'
    }
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleShare = async (method: string) => {
    const shareData = {
      title: 'RE:MIND - The Ultimate Reminder App',
      text: shareText,
      url: referralLink
    }

    switch (method) {
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + referralLink)}`
        window.open(twitterUrl, '_blank')
        break
      
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
        window.open(facebookUrl, '_blank')
        break
      
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`
        window.open(whatsappUrl, '_blank')
        break
      
      case 'email':
        const emailUrl = `mailto:?subject=${encodeURIComponent('Try RE:MIND - The Ultimate Reminder App')}&body=${encodeURIComponent(shareText + '\n\n' + referralLink)}`
        window.open(emailUrl)
        break
      
      case 'copy':
        handleCopyLink()
        break
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share RE:MIND</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Help others discover the magic</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Close sharing modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Friends Referred</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Credits Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days Streak</div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Referral Link
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                  {referralLink}
                </p>
              </div>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sharing Methods */}
        <div className="p-6 pt-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Share via
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {sharingMethods.map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => handleShare(method.id)}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Earn Rewards</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get 1 month free Pro for every 5 successful referrals
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
