import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { DashboardView } from '@/components/dashboard/DashboardView'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-safe">
        <DashboardView />
      </main>
      <MobileNav />
    </div>
  )
}
