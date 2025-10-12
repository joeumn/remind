import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, due_at, notes } = body

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (title.length > 140) {
      return NextResponse.json(
        { error: 'Title must be 140 characters or less' },
        { status: 400 }
      )
    }

    if (notes && notes.length > 2000) {
      return NextResponse.json(
        { error: 'Notes must be 2000 characters or less' },
        { status: 400 }
      )
    }

    // Validate due_at if provided
    let validatedDueAt = null
    if (due_at) {
      const dueDate = new Date(due_at)
      if (isNaN(dueDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid due date format' },
          { status: 400 }
        )
      }
      validatedDueAt = dueDate.toISOString()
    }

    // Insert reminder into database
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        title: title.trim(),
        due_at: validatedDueAt,
        notes: notes?.trim() || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create reminder' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
