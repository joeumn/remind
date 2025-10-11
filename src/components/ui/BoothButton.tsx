'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'
import { Booth } from './Booth'

export function BoothButton() {
  const [isBoothOpen, setIsBoothOpen] = useState(false)

  const handleTryDemo = () => {
    // In a real app, this would redirect to the dashboard or open the quick add modal
    console.log('Redirecting to demo...')
    setIsBoothOpen(false)
  }

  return (
    <>
      {/* Floating Booth Button */}
      <motion.button
        onClick={() => setIsBoothOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-32 right-6 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all group"
        style={{
          boxShadow: '0 20px 60px rgba(249, 115, 22, 0.5)',
        }}
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 4 
          }}
        >
          <Megaphone className="w-7 h-7 group-hover:scale-125 transition-transform" />
        </motion.div>
        
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-ping opacity-25" />
        
        {/* Tooltip */}
        <span className="absolute -top-14 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium shadow-lg">
          🎪 Try Demo
        </span>
      </motion.button>

      {/* Booth Modal */}
      {isBoothOpen && (
        <Booth
          onClose={() => setIsBoothOpen(false)}
          onTryDemo={handleTryDemo}
        />
      )}
    </>
  )
}
