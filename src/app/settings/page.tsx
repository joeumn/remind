import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Notification Preferences</h2>
            <p className="text-sm text-gray-600">Configure your alert channels and preferences</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Default Reminders</h2>
            <p className="text-sm text-gray-600">Set default reminder patterns for new events</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Account</h2>
            <p className="text-sm text-gray-600">Manage your account and subscription</p>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
