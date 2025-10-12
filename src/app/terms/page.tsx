import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
            <CardDescription>
              By using RE:MIND, you agree to these terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              By accessing or using RE:MIND, you agree to be bound by these Terms of Service and our Privacy Policy. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description of Service</CardTitle>
            <CardDescription>
              What RE:MIND provides
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              RE:MIND is a reminder and task management service that allows users to create, manage, and receive 
              notifications for reminders across multiple devices. Our service includes:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Voice capture for quick reminder creation</li>
              <li>• Cross-device synchronization</li>
              <li>• Multiple notification channels (push, email, SMS)</li>
              <li>• Smart categorization and natural language processing</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>
              Account creation and responsibilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Creation</h3>
              <p className="text-sm text-muted-foreground">
                You must provide accurate and complete information when creating an account. 
                You are responsible for maintaining the security of your account credentials.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Account Responsibilities</h3>
              <p className="text-sm text-muted-foreground">
                You are responsible for all activities that occur under your account. 
                You must notify us immediately of any unauthorized use of your account.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
            <CardDescription>
              How you may and may not use our service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Permitted Uses</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Creating and managing personal reminders</li>
                <li>• Using voice capture features as intended</li>
                <li>• Sharing reminders with authorized users</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Prohibited Uses</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Violating any applicable laws or regulations</li>
                <li>• Attempting to gain unauthorized access to our systems</li>
                <li>• Using the service for spam or unsolicited communications</li>
                <li>• Interfering with the proper functioning of the service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription and Payment</CardTitle>
            <CardDescription>
              Billing and subscription terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Free Tier</h3>
              <p className="text-sm text-muted-foreground">
                We offer a free tier with limited features. No payment information is required for the free tier.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Paid Subscriptions</h3>
              <p className="text-sm text-muted-foreground">
                Paid subscriptions are billed monthly or annually. You can cancel your subscription at any time. 
                Refunds are provided according to our refund policy.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
            <CardDescription>
              Our liability limitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              RE:MIND is provided "as is" without warranties of any kind. We are not liable for any damages 
              arising from your use of the service, including but not limited to missed reminders or data loss.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Questions about these terms?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@remind.app" className="underline">
                legal@remind.app
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> This is a placeholder terms of service. Please consult with legal counsel 
            to create comprehensive terms for your specific use case and jurisdiction.
          </p>
        </div>
      </div>
    </div>
  )
}
