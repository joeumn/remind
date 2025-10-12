import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function Pricing() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free, upgrade when you need more power. No hidden fees, no surprises.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Up to 10 reminders</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Basic push notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Mobile & desktop access</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Voice capture (UP→DOWN)</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">SMS notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Priority support</span>
              </li>
            </ul>
            <Link href="/auth/register">
              <Button className="w-full" variant="outline">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-primary">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For power users and professionals</CardDescription>
            <div className="text-3xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited reminders</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All notification types</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Email & SMS notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced voice commands</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Smart categorization</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>API access</span>
              </li>
            </ul>
            <form action="/api/stripe/create-checkout-session" method="POST">
              <input type="hidden" name="priceId" value="price_pro_monthly" />
              <Button type="submit" className="w-full">
                Upgrade to Pro
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center">
              Cancel anytime. <Link href="/terms" className="underline">Terms apply</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                <th className="text-center p-4">Free</th>
                <th className="text-center p-4">Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Reminders</td>
                <td className="text-center p-4">10</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Push Notifications</td>
                <td className="text-center p-4">✓</td>
                <td className="text-center p-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Email Notifications</td>
                <td className="text-center p-4">✗</td>
                <td className="text-center p-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">SMS Notifications</td>
                <td className="text-center p-4">✗</td>
                <td className="text-center p-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Voice Capture</td>
                <td className="text-center p-4">✓</td>
                <td className="text-center p-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Support</td>
                <td className="text-center p-4">Community</td>
                <td className="text-center p-4">Priority</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Questions?</h2>
        <p className="text-muted-foreground mb-6">
          Check out our <Link href="/support" className="underline">support page</Link> or{' '}
          <Link href="/contact" className="underline">contact us</Link> directly.
        </p>
      </div>
    </div>
  )
}