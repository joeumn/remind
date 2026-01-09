import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for upgrading to RE:MIND Pro. Your subscription is now active.
        </p>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Your Pro features are now available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited reminders</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Email & SMS notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Advanced voice commands</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">API access</span>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Link href="/dashboard">
                <Button className="w-full">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full">
                  Manage Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            A confirmation email has been sent to your registered email address. 
            If you have any questions, please{' '}
            <Link href="/contact" className="underline">
              contact our support team
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
