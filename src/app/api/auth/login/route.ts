import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { authRateLimit } from '@/lib/rateLimit'
import { handleApiError, AppError } from '@/lib/errorHandler'
import { analytics } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: rateLimitResult.headers }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      throw new AppError('Missing required fields: email and password', 400)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      throw new AppError('Invalid email or password', 401)
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      throw new AppError('Invalid email or password', 401)
    }

    // Check if account is suspended
    if (user.subscriptionStatus === 'suspended') {
      throw new AppError('Account is suspended. Please contact support.', 403)
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    // Track login event
    analytics.track('user_login', {
      user_id: user.id,
      login_method: 'email'
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    }, {
      headers: rateLimitResult.headers
    })

  } catch (error) {
    return handleApiError(error)
  }
}
