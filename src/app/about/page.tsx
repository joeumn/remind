import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-16">
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About RE:MIND
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe that remembering important things shouldn't be hard. 
            RE:MIND was born from the simple idea that technology should make life easier, not more complicated.
          </p>
        </div>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
            <CardDescription>
              Making reminders effortless across all devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              RE:MIND was created to solve a universal problem: forgetting important things. 
              Whether it's a meeting, a birthday, or a task that needs to be done, we've all experienced 
              the frustration of missing something important.
            </p>
            <p className="text-muted-foreground">
              Our mission is to make reminder management as simple as possible. With voice capture, 
              smart categorization, and seamless synchronization across devices, RE:MIND helps you 
              stay on top of everything that matters.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Simplicity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We believe in keeping things simple. RE:MIND is designed to be intuitive and easy to use, 
                without unnecessary complexity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Time is precious. That's why we've optimized RE:MIND for speed, from voice capture 
                to cross-device synchronization.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Your data is yours. We use industry-standard encryption and never share your 
                personal information without your consent.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We're building RE:MIND with our users, not just for them. Your feedback shapes 
                our product and drives our innovation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
            <CardDescription>
              How RE:MIND came to be
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              RE:MIND started as a personal project when our founder kept missing important deadlines 
              and meetings. Despite using multiple reminder apps, nothing seemed to work seamlessly 
              across all devices and situations.
            </p>
            <p className="text-muted-foreground">
              The breakthrough came with the idea of voice capture using the UP→DOWN sequence. 
              This simple gesture could be performed quickly and discreetly, making it perfect for 
              capturing thoughts on the go.
            </p>
            <p className="text-muted-foreground">
              Today, RE:MIND serves thousands of users worldwide, helping them stay organized 
              and never miss what matters most. We continue to innovate based on user feedback 
              and the latest technology trends.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Team</CardTitle>
            <CardDescription>
              The people behind RE:MIND
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              RE:MIND is built by a passionate team of developers, designers, and product managers 
              who believe in the power of simple, effective solutions.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">Development Team</h3>
                <p className="text-sm text-muted-foreground">
                  Building the technology that powers RE:MIND
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">Design Team</h3>
                <p className="text-sm text-muted-foreground">
                  Creating intuitive and beautiful user experiences
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">Support Team</h3>
                <p className="text-sm text-muted-foreground">
                  Helping users get the most out of RE:MIND
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with RE:MIND. 
            Start your journey to better organization today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
