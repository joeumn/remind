import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { DashboardView } from '@/components/dashboard/DashboardView'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="pb-safe">
        <DashboardView />
      </main>
      <MobileNav />
    </div>
  )
}
