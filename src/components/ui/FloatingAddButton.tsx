'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface FloatingAddButtonProps {
  onClick: () => void
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onTap={() => setIsPressed(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all group"
      style={{
        boxShadow: isPressed
          ? '0 10px 40px rgba(59, 130, 246, 0.5)'
          : '0 20px 60px rgba(59, 130, 246, 0.4)',
      }}
    >
      <motion.div
        animate={{ rotate: isPressed ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
      </motion.div>
      
      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-ping opacity-30" />
      
      {/* Tooltip */}
      <span className="absolute -top-14 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium shadow-lg">
        ⚡ Quick Add Reminder
      </span>
    </motion.button>
  )
}
