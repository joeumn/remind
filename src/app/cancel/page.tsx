import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>What Happened?</CardTitle>
            <CardDescription>
              Your upgrade process was interrupted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Don't worry - no payment was processed and your account remains on the Free plan. 
              You can try upgrading again anytime.
            </p>
            
            <div className="pt-4 space-y-2">
              <Link href="/pricing">
                <Button className="w-full">
                  Try Again
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Need help with the upgrade process?{' '}
            <Link href="/contact" className="underline">
              Contact our support team
            </Link>{' '}
            and we'll be happy to assist you.
          </p>
        </div>
      </div>
    </div>
  )
}
