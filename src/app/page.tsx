import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuickAddReminder } from "@/components/quick-add-reminder"
import { ArrowRight, Clock, Smartphone, Zap, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                The Fastest Way to{' '}
                <span className="text-primary">Set Reminders</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Never miss another crucial date. RE:MIND works across any device with instant voice capture and smart categorization.
              </p>
              
              {/* Value Props */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Instant voice capture with UP→DOWN sequence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Cross-device synchronization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Smart categorization and NLP</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <QuickAddReminder>
                  <Button size="lg" className="gap-2">
                    Try Quick Add
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </QuickAddReminder>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="gap-2">
                    Sign Up Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop Screenshot/Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">RE:MIND</h3>
                    <p className="text-muted-foreground">Desktop App Interface</p>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Professionals</h2>
            <p className="text-muted-foreground">Join thousands of users who never miss important deadlines</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}