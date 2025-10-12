import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>What can you do?</CardTitle>
            <CardDescription>
              Here are some helpful options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button variant="outline" className="w-full" asChild>
                <a href="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </a>
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Still can't find what you're looking for?
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            If you believe this is an error, please{' '}
            <Link href="/contact" className="underline">
              let us know
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
