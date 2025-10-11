# Deployment Guide - Elite Reminder OS

## Quick Start

# Deployment Guide - RE:MIND

## Prerequisites

Your RE:MIND is now running locally at http://localhost:3000

## Pre-Deployment Checklist

- [ ] Set up Supabase project
- [ ] Run database schema
- [ ] Configure environment variables
- [ ] Test locally
- [ ] (Optional) Set up Twilio for SMS
- [ ] (Optional) Set up SendGrid for email
- [ ] (Optional) Set up Stripe for payments

## Step 1: Supabase Setup

### Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: `elite-reminder-os`
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Click "Create new project"

### Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. Verify tables are created in **Table Editor**

### Enable Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. (Optional) Enable Google OAuth, GitHub, etc.

### Get API Keys

1. Go to **Settings** > **API**
2. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

3. Update your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 2: Deploy to Vercel

### Option A: GitHub Deploy (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Elite Reminder OS"
   git remote add origin https://github.com/yourusername/elite-reminder-os.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables**
   
   In Vercel project settings, add these environment variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Option B: Vercel CLI Deploy

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** > **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Step 4: Enable Notifications (Optional)

### SMS with Twilio

1. Sign up at https://twilio.com
2. Get a phone number
3. Get your Account SID and Auth Token
4. Add to Vercel environment variables:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Email with SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify sender email
4. Add to Vercel environment variables:
   ```
   SENDGRID_API_KEY=your_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### Web Push Notifications

1. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```

2. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```

## Step 5: Stripe Integration (Optional)

1. Sign up at https://stripe.com
2. Get your API keys (Publishable and Secret)
3. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## Step 6: Test Your Deployment

1. **Visit your live URL**
   - Landing page should load
   - Navigate to /dashboard
   - Test mobile responsiveness

2. **Test Authentication**
   - Try signing up with email
   - Check Supabase Auth dashboard

3. **Test PWA**
   - On mobile, install as app
   - Test offline functionality

4. **Monitor Logs**
   - Check Vercel Function logs
   - Monitor Supabase logs
   - Set up error tracking (Sentry, etc.)

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` automatically deploys to production
- Preview deployments for pull requests
- Instant rollbacks if needed

## Production Checklist

- [ ] Database is secured with RLS
- [ ] Environment variables are set
- [ ] HTTPS is enforced
- [ ] Custom domain configured
- [ ] Monitoring is set up
- [ ] Backup strategy in place
- [ ] Error tracking configured
- [ ] Analytics integrated
- [ ] SEO metadata verified
- [ ] Performance optimized

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor function invocations
- Check build times
- Review error logs

### Supabase Dashboard
- Monitor database usage
- Check API requests
- Review auth logs

### Set Up Alerts
- Vercel: Set up build failure notifications
- Supabase: Set up database alerts
- Uptime monitoring (UptimeRobot, etc.)

## Scaling Considerations

### Database
- Monitor query performance
- Add indexes as needed
- Consider read replicas for high traffic

### Functions
- Optimize cold starts
- Consider edge functions for global performance

### Storage
- Use Supabase Storage for large files
- Implement CDN for static assets

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Review build logs in Vercel

### 500 Errors
- Check Supabase connection
- Verify environment variables
- Review function logs

### Authentication Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure middleware is working

---

   - Test all features one more time
   - Share with your first users!

**Congratulations! Your RE:MIND is now live! 🎉**
