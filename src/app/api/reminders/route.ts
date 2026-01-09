import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('due_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) query = query.eq('status', status)
    if (category) query = query.eq('category', category)
    if (priority) query = query.eq('priority', priority)
    if (search) query = query.ilike('title', `%${search}%`)

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reminders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reminders: data,
      pagination: {
        limit,
        offset,
        total: count,
        hasMore: (offset + limit) < (count || 0)
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const { 
      title, 
      description, 
      due_at, 
      priority = 'medium', 
      category, 
      tags = [], 
      is_recurring = false,
      recurrence_pattern,
      reminder_settings = {}
    } = body

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less' },
        { status: 400 }
      )
    }

    if (description && description.length > 2000) {
      return NextResponse.json(
        { error: 'Description must be 2000 characters or less' },
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
        description: description?.trim() || null,
        due_at: validatedDueAt,
        priority,
        category: category?.trim() || null,
        tags: Array.isArray(tags) ? tags : [],
        is_recurring,
        recurrence_pattern: recurrence_pattern || null,
        reminder_settings
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
