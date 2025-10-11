import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Schedule</h1>
        <p className="text-gray-600">Full calendar view and event management coming soon...</p>
      </main>
      <MobileNav />
    </div>
  )
}
