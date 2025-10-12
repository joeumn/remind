import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function SupportPage() {
  const faqs = [
    {
      id: 'voice-capture',
      question: 'How does the voice capture feature work?',
      answer: 'RE:MIND uses a simple UP→DOWN sequence: quickly press the volume up button, then immediately press volume down. This activates voice capture mode where you can speak your reminder naturally. The app will process your speech and create a reminder automatically.'
    },
    {
      id: 'sync-devices',
      question: 'How do I sync my reminders across devices?',
      answer: 'RE:MIND automatically syncs your reminders across all devices when you sign in with the same account. Make sure you\'re connected to the internet and signed in on all devices. Changes made on one device will appear on others within seconds.'
    },
    {
      id: 'notifications',
      question: 'Why am I not receiving notifications?',
      answer: 'Check your device notification settings and ensure RE:MIND has permission to send notifications. Also verify that you\'re signed in and have notifications enabled in the app settings. For email notifications, check your spam folder.'
    },
    {
      id: 'always-listening',
      question: 'What is Always Listening mode?',
      answer: 'Always Listening mode enables continuous voice capture so you can create reminders instantly without opening the app. You can toggle this feature in Settings. When enabled, you can use the UP→DOWN sequence at any time to create a reminder.'
    },
    {
      id: 'subscription',
      question: 'What\'s the difference between Free and Pro?',
      answer: 'The Free plan includes up to 10 reminders with basic push notifications. Pro offers unlimited reminders, email and SMS notifications, advanced voice commands, smart categorization, priority support, and API access.'
    },
    {
      id: 'cancel-subscription',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your account settings or by contacting support. Your Pro features will remain active until the end of your current billing period. You can reactivate your subscription anytime.'
    },
    {
      id: 'data-security',
      question: 'Is my data secure?',
      answer: 'Yes, we take data security seriously. All your reminders and personal information are encrypted both in transit and at rest. We use industry-standard security practices and never share your data with third parties without your consent.'
    },
    {
      id: 'offline-mode',
      question: 'Does RE:MIND work offline?',
      answer: 'RE:MIND requires an internet connection to sync your reminders across devices and send notifications. However, you can still view your existing reminders when offline. Voice capture and basic functionality work offline, but reminders won\'t sync until you\'re back online.'
    }
  ]

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and get help with RE:MIND
          </p>
        </div>

        {/* Quick Help */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Getting Started</CardTitle>
              <CardDescription>
                New to RE:MIND? Start here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <Link href="#voice-capture" className="underline">Voice capture setup</Link></li>
                <li>• <Link href="#sync-devices" className="underline">Device synchronization</Link></li>
                <li>• <Link href="#notifications" className="underline">Notification setup</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Troubleshooting</CardTitle>
              <CardDescription>
                Common issues and solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <Link href="#notifications" className="underline">Notification problems</Link></li>
                <li>• <Link href="#sync-devices" className="underline">Sync issues</Link></li>
                <li>• <Link href="#offline-mode" className="underline">Offline functionality</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account & Billing</CardTitle>
              <CardDescription>
                Manage your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <Link href="#subscription" className="underline">Plan comparison</Link></li>
                <li>• <Link href="#cancel-subscription" className="underline">Cancel subscription</Link></li>
                <li>• <Link href="#data-security" className="underline">Data security</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find answers to the most common questions about RE:MIND
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized help from our support team
                </p>
                <Link href="/contact">
                  <button className="text-sm text-primary underline">
                    Send us a message
                  </button>
                </Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  Send us an email and we'll respond within 24 hours
                </p>
                <a href="mailto:support@remind.app" className="text-sm text-primary underline">
                  support@remind.app
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Requests</CardTitle>
            <CardDescription>
              Have an idea for improving RE:MIND?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We love hearing from our users! If you have suggestions for new features or improvements, 
              please let us know through our contact form.
            </p>
            <Link href="/contact">
              <button className="text-sm text-primary underline">
                Submit a feature request
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
