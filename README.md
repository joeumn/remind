# 🧠 RE:MIND - The Future of Reminders

> **Never miss another moment.** The viral-worthy, AI-powered reminder app that transforms how professionals manage their time.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-673AB7)](https://web.dev/progressive-web-apps/)
[![Production Ready](https://img.shields.io/badge/Production-Ready-green)](https://github.com/yourusername/remind)

## ✨ What Makes RE:MIND Special

### 🎯 **Viral-Worthy Design**
- 🎨 **Glassmorphism UI** - Modern, screenshot-worthy interface
- 🌙 **Dark Mode First** - Optimized for social media sharing
- 🎭 **Smooth Animations** - 60fps micro-interactions with Framer Motion
- 📱 **Mobile-First** - Perfect for Instagram stories and TikTok

### ⚡ **Lightning-Fast Experience**
- 🎤 **Voice-First Design** - Just speak and it's done (< 3 seconds)
- 🧠 **AI-Powered Processing** - Smart categorization and priority detection
- 🔄 **Real-time Sync** - Instant synchronization across all devices
- ⚡ **Sub-100ms API** - Blazing fast response times

### 🏆 **Gamification & Social**
- 🎖️ **Achievement System** - Streaks, badges, and rewards
- 📊 **Progress Sharing** - Auto-generated shareable screenshots
- 🏅 **Leaderboards** - Compete with friends and colleagues
- 🎯 **Goal Tracking** - Visual progress indicators

### 🚀 **Advanced Features**
- 🔍 **Smart Search** - Find anything instantly with AI
- 📋 **Bulk Operations** - Manage hundreds of reminders at once
- 🎨 **Smart Templates** - AI-generated reminder templates
- 🔔 **Multi-Channel Alerts** - Push, SMS, Email notifications
- 📈 **Analytics Dashboard** - Detailed productivity insights

### 💼 **Business Ready**
- 💳 **Stripe Integration** - Seamless subscription management
- 👥 **Team Collaboration** - Share reminders with your team
- 🔒 **Enterprise Security** - SOC2 compliant, bank-grade encryption
- 📊 **Business Analytics** - Team productivity insights
- 🔗 **API Access** - Integrate with your existing tools

## 🛠️ Modern Tech Stack

- **Framework**: Next.js 15.5.4 with App Router & React 18
- **Language**: TypeScript 5.0 with strict mode
- **Styling**: Tailwind CSS 3.4 + Framer Motion animations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions
- **Payments**: Stripe with webhook integration
- **Real-time**: Server-Sent Events + WebSocket
- **AI/ML**: OpenAI GPT integration for smart features
- **Notifications**: Web Push API + Email/SMS
- **Storage**: AWS S3 + CloudFront CDN
- **Caching**: Redis for performance optimization
- **Monitoring**: Sentry error tracking + Analytics
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Vercel with automatic CI/CD

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or later
- PostgreSQL 14 or later
- npm or yarn package manager
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/remind.git
cd remind
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

**Minimum required variables for development:**

```env
# Database (use Supabase for quick setup)
DATABASE_URL=postgresql://username:password@localhost:5432/remind_db

# Authentication (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Push Notifications (generate with: npx web-push generate-vapid-keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=mailto:your-email@example.com
```

> 📋 **For production setup**, see [`final-setup-before-live.md`](./final-setup-before-live.md) for complete environment variable guide.

### 4. Database Setup

Create and set up your PostgreSQL database:

```bash
# Create database
createdb remind_db

# Run migrations
psql -d remind_db -f database/schema.sql
```

### 5. Generate VAPID Keys (for push notifications)

```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

Copy the generated keys to your `.env.local` file.

### 6. Start Development Server

   ```bash
   npm run dev
# or
yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from your `.env.local`

### Docker Deployment

1. **Build Docker Image**:
   ```bash
   docker build -t remind-app .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

### Manual Server Deployment

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Database Configuration

The app uses PostgreSQL with the following connection string format:
```
postgresql://username:password@host:port/database_name
```

### Authentication Setup

1. **JWT Secret**: Generate a strong secret key for JWT tokens
2. **NextAuth Configuration**: Configure OAuth providers if needed
3. **Session Management**: Adjust session duration in NextAuth config

### Push Notifications

1. **Generate VAPID Keys**: Use web-push CLI to generate keys
2. **Configure Service Worker**: Update service worker with your VAPID public key
3. **Test Notifications**: Use browser dev tools to test push notifications

### Email Configuration

Configure SMTP settings for email notifications:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
```

## 📊 Monitoring & Analytics

### Error Monitoring

Set up Sentry for error tracking:
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Analytics

Configure Google Analytics:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Performance Monitoring

The app includes built-in performance monitoring:
- Core Web Vitals tracking
- User interaction metrics
- API response time monitoring
- Database query performance

## 🔒 Security

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Enable security headers

### Security Headers

Add these headers to your production deployment:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Database

Set up a separate test database:
```env
DATABASE_URL_TEST=postgresql://username:password@localhost:5432/remind_test
```

## 📱 PWA Configuration

### Manifest Configuration

The app includes a complete PWA manifest (`public/manifest.json`) with:
- App icons in multiple sizes
- Theme colors
- Display modes
- Shortcuts
- Share target configuration

### Service Worker

The service worker (`public/sw.js`) provides:
- Offline functionality
- Background sync
- Push notifications
- Caching strategies

### Installation

Users can install the app:
- **Mobile**: "Add to Home Screen" prompt
- **Desktop**: Install button in browser
- **Automatic**: PWA install prompts

## 🔄 API Documentation

### Events API

#### GET /api/events
Get all events for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Meeting with team",
    "category": "Work",
    "priority": "High",
    "start_date": "2024-01-15T10:00:00Z",
    "end_date": "2024-01-15T11:00:00Z",
    "is_all_day": false,
    "description": "Weekly team sync",
    "location": "Conference Room A",
    "recurrence_type": "Weekly",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/events
Create a new event.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Doctor appointment",
  "category": "Health",
  "priority": "Medium",
  "start_date": "2024-01-20T14:00:00Z",
  "end_date": "2024-01-20T15:00:00Z",
  "description": "Annual checkup",
  "location": "City Medical Center"
}
```

#### PUT /api/events/[id]
Update an existing event.

#### DELETE /api/events/[id]
Delete an event.

### Push Notifications API

#### POST /api/push/subscribe
Subscribe to push notifications.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "base64-encoded-key",
    "auth": "base64-encoded-key"
  }
}
```

## 🚀 Performance Optimization

### Built-in Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Aggressive caching strategies
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo and useMemo

### Performance Monitoring

```bash
# Analyze bundle size
npm run analyze

# Check Core Web Vitals
npm run lighthouse
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Push Notifications Not Working**
   - Verify VAPID keys are set
   - Check browser notification permissions
   - Ensure HTTPS in production

3. **PWA Installation Issues**
   - Check manifest.json validity
   - Verify service worker registration
   - Ensure all required icons exist

4. **Build Errors**
   - Clear .next folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

### Debug Mode

Enable debug logging:
```env
DEBUG=remind:*
```

## 📈 Scaling

### Database Scaling

- **Read Replicas**: Set up read replicas for better performance
- **Connection Pooling**: Use PgBouncer for connection pooling
- **Sharding**: Implement database sharding for large datasets

### Application Scaling

- **Horizontal Scaling**: Deploy multiple app instances
- **Load Balancing**: Use Vercel or AWS ALB
- **CDN**: Use Vercel Edge Network or CloudFlare

### Monitoring

- **APM**: Set up Application Performance Monitoring
- **Logs**: Centralized logging with services like LogRocket
- **Metrics**: Monitor key business metrics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information.

### Quick Start
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Issue Templates
Use our structured templates for better communication:
- 🐛 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) - Report bugs or unexpected behavior
- ✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) - Suggest new features
- ⚡ [Performance Issue](.github/ISSUE_TEMPLATE/performance_issue.yml) - Report performance problems
- 🔒 [Security Issue](.github/ISSUE_TEMPLATE/security_issue.yml) - Report security vulnerabilities

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.remind.app](https://docs.remind.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/remind/issues)
- **Discord**: [Join our community](https://discord.gg/remind)
- **Email**: support@remind.app

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core reminder functionality
- ✅ PWA support
- ✅ Push notifications
- ✅ Dark mode
- ✅ Voice input

### Phase 2 (Q2 2024)
- 🔄 Team collaboration
- 🔄 Advanced analytics
- 🔄 Mobile apps (iOS/Android)
- 🔄 AI-powered insights

### Phase 3 (Q3 2024)
- 📅 Enterprise features
- 📅 Advanced integrations
- 📅 White-label solution
- 📅 API marketplace

---

**Built with ❤️ by the RE:MIND team**

*Never miss another crucial date.*