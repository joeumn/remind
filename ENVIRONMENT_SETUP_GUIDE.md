# 🔧 RE:MIND Environment Setup Guide

## **Complete Environment Variables Configuration**

This guide will walk you through setting up ALL environment variables needed for RE:MIND to work in production.

---

## **📋 STEP-BY-STEP SETUP**

### **1. Create Environment File**

```bash
# Copy the template
cp env.production.example .env.local

# Edit with your actual values
nano .env.local  # or use your preferred editor
```

---

## **🗄️ DATABASE & BACKEND SETUP**

### **Supabase Configuration**

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Copy URL and keys
   ```

2. **Add to .env.local**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Database Setup**
   ```sql
   -- Run this in Supabase SQL Editor
   -- Copy from supabase/schema.sql
   ```

### **Prisma Database**
   ```env
   # Database (if using separate PostgreSQL)
   DATABASE_URL=postgresql://user:password@host:port/database?schema=public
   ```

---

## **🔐 AUTHENTICATION SETUP**

### **NextAuth.js Configuration**

1. **Generate Secrets**
   ```bash
   # Generate a secure secret (32+ characters)
   openssl rand -base64 32
   ```

2. **Add to .env.local**
   ```env
   # Authentication
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_generated_secret_32_chars_minimum
   ```

### **JWT Configuration**
   ```env
   # Security
   JWT_SECRET=your_jwt_secret_32_chars_minimum
   ENCRYPTION_KEY=your_encryption_key_32_chars
   ```

---

## **📧 EMAIL NOTIFICATIONS SETUP**

### **Gmail SMTP (Recommended)**

1. **Enable App Passwords**
   ```bash
   # Go to Google Account Settings
   # Security → 2-Step Verification → App passwords
   # Generate app password for "Mail"
   ```

2. **Add to .env.local**
   ```env
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your_16_character_app_password
   FROM_EMAIL=noreply@remind.app
   ```

### **Alternative Email Providers**

**SendGrid:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your_sendgrid_api_key
   ```

**Mailgun:**
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=your_mailgun_smtp_user
   SMTP_PASSWORD=your_mailgun_smtp_password
   ```

---

## **🔔 PUSH NOTIFICATIONS SETUP**

### **VAPID Keys Generation**

1. **Generate VAPID Keys**
   ```bash
   # Install web-push globally
   npm install -g web-push
   
   # Generate keys
   web-push generate-vapid-keys
   ```

2. **Add to .env.local**
   ```env
   # Push Notifications
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```

---

## **💳 STRIPE PAYMENTS SETUP**

### **Stripe Account Setup**

1. **Create Stripe Account**
   ```bash
   # Go to https://stripe.com
   # Create account and get API keys
   ```

2. **Add to .env.local**
   ```env
   # Stripe Payments
   STRIPE_PUBLIC_KEY=pk_live_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

3. **Configure Webhook**
   ```bash
   # In Stripe Dashboard → Webhooks
   # Add endpoint: https://your-domain.vercel.app/api/stripe/webhook
   # Select events:
   #   - checkout.session.completed
   #   - customer.subscription.created
   #   - customer.subscription.updated
   #   - customer.subscription.deleted
   #   - invoice.payment_succeeded
   #   - invoice.payment_failed
   ```

### **Test vs Live Keys**

**Development (Test Keys):**
   ```env
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

**Production (Live Keys):**
   ```env
   STRIPE_PUBLIC_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

---

## **📊 ANALYTICS & MONITORING**

### **Google Analytics**

1. **Create GA4 Property**
   ```bash
   # Go to https://analytics.google.com
   # Create property and get Measurement ID
   ```

2. **Add to .env.local**
   ```env
   # Analytics
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

### **Sentry Error Monitoring**

1. **Create Sentry Project**
   ```bash
   # Go to https://sentry.io
   # Create project and get DSN
   ```

2. **Add to .env.local**
   ```env
   # Error Monitoring
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   ```

---

## **⚙️ FEATURE FLAGS & CONFIGURATION**

### **App Configuration**
   ```env
   # App Settings
   NEXT_PUBLIC_APP_NAME=RE:MIND
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   
   # Feature Flags
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
   NEXT_PUBLIC_ENABLE_PWA=true
   ```

### **Rate Limiting**
   ```env
   # Rate Limiting (15 minutes = 900000ms)
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

---

## **🎁 REFERRAL SYSTEM**

### **Referral Configuration**
   ```env
   # Referral Rewards
   REFERRAL_REWARD_AMOUNT=5.00
   REFERRAL_BONUS_TIERS=5,10,25,50
   ```

---

## **🎵 VOLUME BUTTON CAPTURE**

### **Volume Capture Settings**
   ```env
   # Volume Button Capture
   VOLUME_CAPTURE_ENABLED=true
   VOLUME_SEQUENCE_TIMEOUT=800
   VOLUME_ACTIVATION_JINGLE=true
   ```

---

## **📱 SMS NOTIFICATIONS (Optional)**

### **Twilio SMS Setup**

1. **Create Twilio Account**
   ```bash
   # Go to https://twilio.com
   # Get Account SID, Auth Token, and Phone Number
   ```

2. **Add to .env.local**
   ```env
   # SMS Notifications (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

---

## **🔍 VALIDATION & TESTING**

### **Environment Validation Script**

Create `scripts/validate-env.js`:
```javascript
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
]

console.log('🔍 Validating environment variables...')

let allValid = true
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing: ${envVar}`)
    allValid = false
  } else {
    console.log(`✅ Found: ${envVar}`)
  }
})

if (allValid) {
  console.log('🎉 All required environment variables are set!')
} else {
  console.log('⚠️  Some environment variables are missing. Please check your .env.local file.')
  process.exit(1)
}
```

### **Run Validation**
```bash
node scripts/validate-env.js
```

---

## **🚀 DEPLOYMENT CHECKLIST**

### **Pre-Deployment**

- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Stripe webhook configured
- [ ] Email service tested
- [ ] Push notifications tested
- [ ] Analytics tracking verified

### **Post-Deployment**

- [ ] Test user registration
- [ ] Test payment flow
- [ ] Test notifications
- [ ] Test volume button capture
- [ ] Monitor error logs
- [ ] Check analytics data

---

## **🔒 SECURITY BEST PRACTICES**

### **Environment Security**

1. **Never commit .env files**
   ```bash
   # Ensure .env.local is in .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use strong secrets**
   ```bash
   # Generate cryptographically secure secrets
   openssl rand -base64 32
   ```

3. **Rotate keys regularly**
   - Update API keys quarterly
   - Monitor for suspicious activity
   - Use different keys for dev/staging/prod

### **Production Security**

1. **Enable HTTPS only**
2. **Set up CORS properly**
3. **Use environment-specific configurations**
4. **Monitor API usage and limits**

---

## **🆘 TROUBLESHOOTING**

### **Common Issues**

**Database Connection Failed:**
```bash
# Check DATABASE_URL format
# Ensure database is accessible
# Verify credentials
```

**Email Not Sending:**
```bash
# Check SMTP credentials
# Verify app password (Gmail)
# Check firewall settings
```

**Stripe Webhook Failing:**
```bash
# Verify webhook secret
# Check endpoint URL
# Review webhook events
```

**Push Notifications Not Working:**
```bash
# Verify VAPID keys
# Check service worker registration
# Test in HTTPS environment
```

---

## **📞 SUPPORT**

If you encounter issues:

1. **Check the logs** in Vercel dashboard
2. **Verify environment variables** with validation script
3. **Test each service** individually
4. **Review documentation** for each service
5. **Contact support** for specific services if needed

---

## **🎉 READY TO LAUNCH!**

Once all environment variables are configured:

1. **Run validation script**
2. **Test locally** with `npm run dev`
3. **Deploy to production** with `vercel --prod`
4. **Monitor and iterate**

**RE:MIND is now ready to revolutionize reminder apps!** 🚀
