# Contributing to RE:MIND

Thank you for your interest in contributing to RE:MIND! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Submit a pull request** with a clear description

## 📋 Issue Templates

We use GitHub issue templates to ensure all necessary information is provided:

- 🐛 **[Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)** - Report bugs or unexpected behavior
- ✨ **[Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)** - Suggest new features or enhancements
- ⚡ **[Performance Issue](.github/ISSUE_TEMPLATE/performance_issue.yml)** - Report slow performance or optimization opportunities
- 🔒 **[Security Issue](.github/ISSUE_TEMPLATE/security_issue.yml)** - Report security vulnerabilities (use private email for critical issues)

## 🛠️ Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm (package manager)
- PostgreSQL database
- Git

### Installation
```bash
# Clone your fork
git clone https://github.com/your-username/remindz.git
cd remindz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with the following variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/remind"

# Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Push Notifications
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-email-password"
FROM_EMAIL="noreply@remind.app"
```

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run linting
npm run lint

# Fix linting errors
npm run lint:fix

# Type checking
npm run type-check
```

### Test Requirements
- **Unit tests** are required for new features and bug fixes
- **Integration tests** are required for API endpoints
- **End-to-end tests** are required for user-facing features
- Aim for **80%+ code coverage** on new code

## 📝 Coding Standards

### TypeScript
- Use **strict mode** TypeScript
- Define proper types for all functions and variables
- Avoid `any` types - use specific types instead
- Use interfaces for object shapes

### React
- Use **functional components** with hooks
- Implement proper **error boundaries**
- Use **React.memo** for performance optimization
- Follow **React best practices** for state management

### Code Style
- Use **ESLint** and **Prettier** for consistent formatting
- Follow **conventional commits** for commit messages
- Write **self-documenting code** with clear variable names
- Add **JSDoc comments** for complex functions

### Security
- **Validate all inputs** on both client and server
- Use **parameterized queries** for database operations
- Implement **rate limiting** on API endpoints
- Follow **OWASP security guidelines**

## 🔄 Pull Request Process

### Before Submitting
1. **Ensure tests pass**: `npm test && npm run lint && npm run type-check`
2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Update CHANGELOG.md** if applicable

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

### Review Process
1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** and merge to main

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **Testing**: Jest, Playwright
- **Deployment**: Vercel

### Key Directories
```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/            # API endpoints
│   └── (routes)/       # Page routes
├── components/         # React components
├── lib/               # Shared utilities and configurations
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions

database/
├── schema.sql         # Database schema
└── migrations/        # Database migrations

public/
├── sw.js             # Service worker
└── manifest.json     # PWA manifest
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (browser, OS, version)
- **Screenshots or error logs** if applicable

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) for structured reporting.

## ✨ Feature Requests

When requesting features, please include:
- **Problem statement** - what problem does this solve?
- **Proposed solution** - how should it work?
- **User story** - who benefits and how?
- **Acceptance criteria** - what defines success?

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml) for structured requests.

## 🔒 Security

### Reporting Security Issues
- **Critical vulnerabilities**: Email security@remind.app (do not create public issues)
- **Other security concerns**: Use our [Security Issue Template](.github/ISSUE_TEMPLATE/security_issue.yml)

### Security Guidelines
- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Follow secure coding practices
- Keep dependencies updated

## 📞 Getting Help

- **Documentation**: Check the [README.md](README.md)
- **Discussions**: Use [GitHub Discussions](https://github.com/joeumn/remindz/discussions)
- **Issues**: Create an issue using our templates
- **Support**: Check [Support Discussions](https://github.com/joeumn/remindz/discussions/categories/support)

## 📄 License

By contributing to RE:MIND, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for helping make RE:MIND better for everyone! 🎉
