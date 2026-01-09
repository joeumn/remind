import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Reminder not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reminder' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updates: any = {}

    // Validate and prepare updates
    if (body.title !== undefined) {
      if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title is required' },
          { status: 400 }
        )
      }
      if (body.title.length > 200) {
        return NextResponse.json(
          { error: 'Title must be 200 characters or less' },
          { status: 400 }
        )
      }
      updates.title = body.title.trim()
    }

    if (body.description !== undefined) {
      if (body.description && body.description.length > 2000) {
        return NextResponse.json(
          { error: 'Description must be 2000 characters or less' },
          { status: 400 }
        )
      }
      updates.description = body.description?.trim() || null
    }

    if (body.due_at !== undefined) {
      if (body.due_at) {
        const dueDate = new Date(body.due_at)
        if (isNaN(dueDate.getTime())) {
          return NextResponse.json(
            { error: 'Invalid due date format' },
            { status: 400 }
          )
        }
        updates.due_at = dueDate.toISOString()
      } else {
        updates.due_at = null
      }
    }

    if (body.priority !== undefined) {
      if (!['low', 'medium', 'high', 'urgent'].includes(body.priority)) {
        return NextResponse.json(
          { error: 'Invalid priority level' },
          { status: 400 }
        )
      }
      updates.priority = body.priority
    }

    if (body.status !== undefined) {
      if (!['pending', 'completed', 'cancelled', 'snoozed'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      updates.status = body.status
      
      // Set completed_at if marking as completed
      if (body.status === 'completed' && !body.completed_at) {
        updates.completed_at = new Date().toISOString()
      } else if (body.status !== 'completed') {
        updates.completed_at = null
      }
    }

    if (body.category !== undefined) {
      updates.category = body.category?.trim() || null
    }

    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags) ? body.tags : []
    }

    if (body.reminder_settings !== undefined) {
      updates.reminder_settings = body.reminder_settings
    }

    // Update reminder
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Reminder not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update reminder' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete reminder' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
