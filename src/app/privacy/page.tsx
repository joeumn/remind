import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
            <CardDescription>
              We collect information you provide directly to us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                When you create an account, we collect your email address and password. 
                We use this information to provide and maintain your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Reminder Data</h3>
              <p className="text-sm text-muted-foreground">
                We store your reminders, including titles, descriptions, dates, and any notes you add. 
                This data is encrypted and only accessible to you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Information</h3>
              <p className="text-sm text-muted-foreground">
                We collect information about how you use our service, including device information, 
                IP address, and usage patterns to improve our service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
            <CardDescription>
              We use your information to provide and improve our service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• To provide, maintain, and improve our services</li>
              <li>• To send you reminders and notifications</li>
              <li>• To communicate with you about your account</li>
              <li>• To analyze usage patterns and improve our service</li>
              <li>• To ensure the security of our service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
            <CardDescription>
              We take the security of your data seriously
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted both 
              in transit and at rest.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
            <CardDescription>
              You have control over your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account and data</li>
              <li>• Export your data</li>
              <li>• Opt out of marketing communications</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Questions about this privacy policy?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@remind.app" className="underline">
                privacy@remind.app
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> This is a placeholder privacy policy. Please consult with legal counsel 
            to create a comprehensive privacy policy for your specific use case and jurisdiction.
          </p>
        </div>
      </div>
    </div>
  )
}
