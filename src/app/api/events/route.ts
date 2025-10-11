import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { apiRateLimit } from '@/lib/rateLimit'
import { handleApiError, AppError } from '@/lib/errorHandler'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: rateLimitResult.headers }
      )
    }

    // Authentication
    const auth = await authenticateRequest(request)
    if (!auth) {
      throw new AppError('Unauthorized', 401)
    }

    // Fetch events from database
    const events = await prisma.event.findMany({
      where: {
        userId: auth.userId,
        status: 'active'
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return NextResponse.json(events, { headers: rateLimitResult.headers })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: rateLimitResult.headers }
      )
    }

    // Authentication
    const auth = await authenticateRequest(request)
    if (!auth) {
      throw new AppError('Unauthorized', 401)
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.startDate) {
      throw new AppError('Missing required fields: title and startDate', 400)
    }

    // Create new event in database
    const newEvent = await prisma.event.create({
      data: {
        userId: auth.userId,
        title: body.title,
        description: body.description || '',
        category: body.category || 'Personal',
        priority: body.priority || 'Medium',
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isAllDay: body.isAllDay || false,
        location: body.location || '',
        recurrenceType: body.recurrenceType || 'None',
        recurrencePattern: body.recurrencePattern || null,
        prepTasks: body.prepTasks || [],
        metadata: body.metadata || {},
        status: 'active'
      }
    })

    return NextResponse.json(newEvent, { 
      status: 201,
      headers: rateLimitResult.headers
    })
  } catch (error) {
    return handleApiError(error)
  }
}