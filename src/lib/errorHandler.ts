import { NextResponse } from 'next/server'
import { analytics } from './analytics'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  // Track error in analytics
  analytics.trackError(
    error instanceof Error ? error.message : 'Unknown error',
    {
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }
  )

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    )
  }

  // Handle specific error types
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: 'Invalid JSON in request body',
        statusCode: 400,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }

  if (error instanceof TypeError) {
    return NextResponse.json(
      {
        error: 'Invalid request data',
        statusCode: 400,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }

  // Generic server error
  return NextResponse.json(
    {
      error: 'Internal server error',
      statusCode: 500,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  )
}

export function validateRequest(data: Record<string, unknown>, schema: { required?: string[] }) {
  // Simple validation - in production, use a library like Zod or Joi
  const requiredFields = schema.required || []
  const missingFields = requiredFields.filter((field: string) => !data[field])

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400
    )
  }

  return true
}

export function rateLimitCheck(ip: string, endpoint: string) {
  // Simple rate limiting - in production, use Redis or similar
  const rateLimitKey = `rate_limit_${ip}_${endpoint}`
  const requests = parseInt(localStorage.getItem(rateLimitKey) || '0')
  const limit = 100 // requests per hour
  const windowMs = 60 * 60 * 1000 // 1 hour

  if (requests >= limit) {
    throw new AppError('Rate limit exceeded', 429)
  }

  // Increment counter (mock implementation)
  localStorage.setItem(rateLimitKey, (requests + 1).toString())
  
  // Reset counter after window
  setTimeout(() => {
    localStorage.removeItem(rateLimitKey)
  }, windowMs)

  return true
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandlers() {
  if (typeof window !== 'undefined') {
    // Client-side error handling
    window.addEventListener('error', (event) => {
      analytics.trackError(event.error?.message || 'Unknown error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      analytics.trackError('Unhandled promise rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      })
    })
  }
}
