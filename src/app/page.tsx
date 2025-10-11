'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Bell, Shield, Zap, Clock, Mail, Mic, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Never Miss Another
            <br />
            <span className="text-blue-600">Crucial Date Again</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            RE:MIND is the ultimate scheduling and reminder system for high-performance professionals, lawyers, and founders who demand absolute reliability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Try It Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Built for Absolute Reliability
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Effortless Quick Add"
              description="Just type or speak. 'Call mom tomorrow at 3pm' - done! Natural language processing understands you."
              highlighted={true}
            />
            <FeatureCard
              icon={<Mic className="w-8 h-8" />}
              title="Voice-Powered"
              description="Tap the mic and speak your reminder. Hands-free reminder creation while driving or cooking."
              highlighted={true}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="One-Tap Quick Times"
              description="'30 min', '1 hour', 'Tomorrow 9am' - instant reminders without typing dates and times."
              highlighted={true}
            />
            <FeatureCard
              icon={<Bell className="w-8 h-8" />}
              title="Multi-Layer Reminders"
              description="Get notified 14d, 7d, 3d, 1d, 2h, and 1h before every event. Customizable to your needs."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Smart Categorization"
              description="Organize by Court, Work, Family, Personal, Recovery. Color-coded for instant recognition."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Accountability Partners"
              description="Send automatic copies to trusted contacts for crucial court dates and meetings."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Priority System"
              description="Urgent events trigger early warnings. Smart prioritization keeps you ahead."
            />
            <FeatureCard
              icon={<Mail className="w-8 h-8" />}
              title="Daily & Weekly Briefings"
              description="SMS and email summaries keep you informed of what's ahead."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Beautiful UI"
              description="Apple Calendar meets Notion. Clean, fast, and delightful to use every day."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Trusted by Professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-600 mb-4">
                  &quot;RE:MIND transformed how I manage my practice. I haven&apos;t missed a court date in 6 months.&quot;
                </p>
                <p className="font-semibold text-gray-900">- Professional User</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join early access and never miss what matters most.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">&copy; 2025 RE:MIND. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, highlighted = false }: { icon: React.ReactNode; title: string; description: string; highlighted?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl border-2 hover:shadow-lg transition-all ${
        highlighted
          ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-300 shadow-md'
          : 'bg-gray-50 border-gray-100 hover:border-blue-200'
      }`}
    >
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
        highlighted
          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
          : 'bg-blue-100 text-blue-600'
      }`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
        {highlighted && <span className="ml-2 text-lg">✨</span>}
      </h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

