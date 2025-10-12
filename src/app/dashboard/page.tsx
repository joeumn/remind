'use client'

import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { ViralDashboard } from '@/components/ui/ViralDashboard'
import { QuickAddReminder } from '@/components/quick-add-reminder'
import { useState } from 'react'

export default function DashboardPage() {
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="pb-safe">
        <ViralDashboard 
          onQuickAdd={() => setShowQuickAdd(true)}
        />
      </main>
      <MobileNav />
      
       {/* Quick Add Modal */}
       <QuickAddReminder>
         <div className="hidden" />
       </QuickAddReminder>
    </div>
  )
}
