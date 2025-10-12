import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.remind.app;"
  )

  // Rate limiting (basic implementation)
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
  const rateLimitKey = `rate_limit_${ip}`
  
  // Check rate limit (you'd implement this with Redis in production)
  // For now, we'll just add the header
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')

  // API route protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip auth for public endpoints
    const publicEndpoints = ['/api/auth', '/api/health']
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      request.nextUrl.pathname.startsWith(endpoint)
    )

    if (!isPublicEndpoint) {
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
  }

  // PWA manifest and service worker
  if (request.nextUrl.pathname === '/manifest.json') {
    response.headers.set('Content-Type', 'application/manifest+json')
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  if (request.nextUrl.pathname === '/sw.js') {
    response.headers.set('Content-Type', 'application/javascript')
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}