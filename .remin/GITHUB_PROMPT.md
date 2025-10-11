# RE:MIND - Standard GitHub User Prompt

Use this prompt when working with the RE:MIND repository to ensure consistent, high-quality contributions.

## 🎯 **Repository Context**
RE:MIND is a modern reminder app built with Next.js 15, featuring:
- **Authentication**: JWT-based with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Testing**: Jest + Playwright
- **Deployment**: Vercel-ready with Docker support
- **Security**: Rate limiting, input validation, error handling

## 📋 **Standard Prompt Template**

```
I'm working on the RE:MIND project (https://github.com/[your-username]/remindz). 

**Current Issue/Feature Request:**
[Describe the specific issue or feature you want to implement]

**Acceptance Criteria:**
- [ ] [Specific, testable outcome 1]
- [ ] [Specific, testable outcome 2]
- [ ] [Specific, testable outcome 3]

**Technical Context:**
- Package Manager: npm
- Test Runner: Jest (unit) + Playwright (e2e)
- Database: PostgreSQL with Prisma
- Authentication: JWT with NextAuth.js
- Deployment: Vercel serverless

**Environment Variables Needed:**
- JWT_SECRET
- DATABASE_URL
- NEXTAUTH_SECRET
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY

**Constraints:**
- Must work on Vercel serverless
- Must maintain TypeScript strict mode
- Must include unit tests for new features
- Must follow existing code patterns

**Files to Consider:**
- src/app/api/* - API routes
- src/lib/* - Shared utilities
- src/components/* - React components
- src/hooks/* - Custom React hooks
- database/schema.sql - Database schema
- .github/workflows/ci.yml - CI/CD pipeline

Please provide a minimal, PR-ready implementation with:
1. Code changes (with exact line numbers)
2. Unit tests
3. Documentation updates
4. Migration scripts (if database changes)
5. Rollback instructions
```

## 🔧 **Common Use Cases**

### **Bug Fixes**
```
**Issue:** [Bug description with steps to reproduce]
**Expected Behavior:** [What should happen]
**Actual Behavior:** [What currently happens]
**Error Logs:** [Paste relevant error messages]
```

### **Feature Requests**
```
**Feature:** [Feature name and description]
**User Story:** As a [user type], I want [goal] so that [benefit]
**Acceptance Criteria:**
- [ ] [Specific requirement 1]
- [ ] [Specific requirement 2]
```

### **Performance Improvements**
```
**Performance Issue:** [Describe the performance problem]
**Current Metrics:** [Current performance data]
**Target Metrics:** [Desired performance improvements]
**Constraints:** [Any limitations or requirements]
```

### **Security Enhancements**
```
**Security Concern:** [Describe the security issue]
**Risk Level:** [Low/Medium/High]
**Affected Components:** [List affected parts of the system]
**Compliance Requirements:** [Any security standards to meet]
```

## 📝 **Code Quality Standards**

When implementing changes, ensure:

- ✅ **TypeScript**: Strict mode enabled, proper type definitions
- ✅ **Testing**: Unit tests for business logic, integration tests for APIs
- ✅ **Error Handling**: Proper error boundaries and API error responses
- ✅ **Security**: Input validation, authentication checks, rate limiting
- ✅ **Performance**: Optimized queries, proper caching, lazy loading
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Documentation**: Inline comments for complex logic, README updates

## 🚀 **Deployment Checklist**

Before submitting PR:
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] Environment variables documented
- [ ] Database migrations included (if needed)
- [ ] Breaking changes documented

## 📚 **Quick Reference**

**Key Directories:**
- `src/app/api/` - API routes (Next.js App Router)
- `src/lib/` - Shared utilities and configurations
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `database/` - Database schema and migrations
- `public/` - Static assets and PWA files

**Important Files:**
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `prisma/schema.prisma` - Database schema
- `.env.example` - Environment variables template

**Testing Commands:**
```bash
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run end-to-end tests
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
```

## 🤝 **Contribution Guidelines**

1. **Fork & Branch**: Create feature branch from `main`
2. **Test First**: Write tests before implementation
3. **Small PRs**: Keep changes focused and reviewable
4. **Documentation**: Update README/docs for user-facing changes
5. **Security**: Never commit secrets or sensitive data
6. **Performance**: Consider impact on app performance
7. **Accessibility**: Ensure changes work for all users

---

**Remember**: This is a production-ready app serving real users. Quality and security are paramount.
