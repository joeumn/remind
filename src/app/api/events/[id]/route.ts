import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { apiRateLimit } from '@/lib/rateLimit'
import { handleApiError, AppError } from '@/lib/errorHandler'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const eventId = params.id

    // Fetch event from database
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: auth.userId,
        status: 'active'
      }
    })

    if (!event) {
      throw new AppError('Event not found', 404)
    }

    return NextResponse.json(event, { headers: rateLimitResult.headers })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const eventId = params.id
    const body = await request.json()

    // Validate event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: auth.userId,
        status: 'active'
      }
    })

    if (!existingEvent) {
      throw new AppError('Event not found', 404)
    }

    // Update event in database
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: body.title || existingEvent.title,
        description: body.description !== undefined ? body.description : existingEvent.description,
        category: body.category || existingEvent.category,
        priority: body.priority || existingEvent.priority,
        startDate: body.startDate ? new Date(body.startDate) : existingEvent.startDate,
        endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : existingEvent.endDate,
        isAllDay: body.isAllDay !== undefined ? body.isAllDay : existingEvent.isAllDay,
        location: body.location !== undefined ? body.location : existingEvent.location,
        recurrenceType: body.recurrenceType || existingEvent.recurrenceType,
        recurrencePattern: body.recurrencePattern !== undefined ? body.recurrencePattern : existingEvent.recurrencePattern,
        prepTasks: body.prepTasks !== undefined ? body.prepTasks : existingEvent.prepTasks,
        metadata: body.metadata !== undefined ? body.metadata : existingEvent.metadata,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedEvent, { headers: rateLimitResult.headers })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const eventId = params.id

    // Validate event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: auth.userId,
        status: 'active'
      }
    })

    if (!existingEvent) {
      throw new AppError('Event not found', 404)
    }

    // Soft delete event (set status to deleted)
    await prisma.event.update({
      where: { id: eventId },
      data: {
        status: 'deleted',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true }, { headers: rateLimitResult.headers })
  } catch (error) {
    return handleApiError(error)
  }
}