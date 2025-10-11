import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { authRateLimit } from '@/lib/rateLimit'
import { handleApiError, AppError } from '@/lib/errorHandler'
import { analytics } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429, headers: rateLimitResult.headers }
      )
    }

    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      throw new AppError('Missing required fields: name, email, and password', 400)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400)
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new AppError('User with this email already exists', 409)
    }

    // Create new user
    const hashedPassword = hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        timezone: body.timezone || 'UTC',
        language: body.language || 'en'
      },
      select: {
        id: true,
        name: true,
        email: true,
        timezone: true,
        language: true,
        subscriptionTier: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    // Track registration event
    analytics.track('user_registered', {
      user_id: user.id,
      registration_method: 'email'
    })

    return NextResponse.json({
      user,
      token,
      message: 'Registration successful'
    }, { 
      status: 201,
      headers: rateLimitResult.headers
    })

  } catch (error) {
    return handleApiError(error)
  }
}
