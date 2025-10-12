'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, RefreshCw, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-6xl font-bold text-destructive mb-4">500</div>
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We're sorry, but something unexpected happened. Please try again.
        </p>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>What can you do?</CardTitle>
            <CardDescription>
              Try these options to get back on track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={reset} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                If the problem persists, please contact support.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {process.env.NODE_ENV === 'development' && (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-sm">Development Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Error ID: {error.digest || 'unknown'} •{' '}
            <Link href="/contact" className="underline">
              Report this issue
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
