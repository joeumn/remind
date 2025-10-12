import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>()
  
  private cleanup() {
    const now = Date.now()
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key)
      }
    }
  }

  check(req: NextRequest, config: RateLimitConfig): RateLimitInfo {
    this.cleanup()
    
    const key = config.keyGenerator ? config.keyGenerator(req) : this.defaultKeyGenerator(req)
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    const current = this.store.get(key)
    
    if (!current || now > current.resetTime) {
      // New window
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })
      
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: now + config.windowMs
      }
    }
    
    if (current.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        limit: config.maxRequests,
        remaining: 0,
        reset: current.resetTime,
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      }
    }
    
    // Increment count
    current.count++
    
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests - current.count,
      reset: current.resetTime
    }
  }
  
  private defaultKeyGenerator(req: NextRequest): string {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const userAgent = req.headers.get('user-agent') ?? 'unknown'
    return `${ip}:${userAgent}`
  }
}

const rateLimiter = new RateLimiter()

export function createRateLimit(config: RateLimitConfig) {
  return (req: NextRequest) => {
    const info = rateLimiter.check(req, config)
    
    if (info.remaining < 0) {
      return {
        success: false,
        info,
        headers: {
          'X-RateLimit-Limit': info.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(info.reset / 1000).toString(),
          'Retry-After': (info.retryAfter?.toString() ?? '60')
        } as Record<string, string>
      }
    }
    
    return {
      success: true,
      info,
      headers: {
        'X-RateLimit-Limit': info.limit.toString(),
        'X-RateLimit-Remaining': info.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(info.reset / 1000).toString()
      } as Record<string, string>
    }
  }
}

// Predefined rate limiters
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per window
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    return `auth:${ip}`
  }
})

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // 1000 requests per window
})

export const strictRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
})
