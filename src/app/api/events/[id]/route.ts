import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, replace with real database
let events: any[] = []

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userId = 'demo-user' // Extract from JWT
    const eventId = params.id

    const body = await request.json()

    // Find event index
    const eventIndex = events.findIndex(event => event.id === eventId && event.user_id === userId)
    
    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Update event
    events[eventIndex] = {
      ...events[eventIndex],
      ...body,
      id: eventId, // Ensure ID doesn't change
      user_id: userId, // Ensure user doesn't change
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(events[eventIndex])
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userId = 'demo-user' // Extract from JWT
    const eventId = params.id

    // Find event index
    const eventIndex = events.findIndex(event => event.id === eventId && event.user_id === userId)
    
    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Remove event
    events.splice(eventIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}