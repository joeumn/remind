import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/contact/contact-form'

export default function ContactPage() {

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>

        <ContactForm />

        <Card>
          <CardHeader>
            <CardTitle>Other ways to reach us</CardTitle>
            <CardDescription>
              Prefer a different method? Here are other ways to get in touch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">📧</span>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">
                  <a href="mailto:support@remind.app" className="underline">
                    support@remind.app
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">💬</span>
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Available Monday-Friday, 9 AM - 5 PM EST
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">📱</span>
              </div>
              <div>
                <h3 className="font-semibold">Help Center</h3>
                <p className="text-sm text-muted-foreground">
                  <a href="/support" className="underline">
                    Browse our FAQ and guides
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
