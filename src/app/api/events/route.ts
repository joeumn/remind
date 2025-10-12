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
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')
    const event_type = searchParams.get('event_type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_at', { ascending: true })

    // Apply date filters
    if (start_date) {
      query = query.gte('start_at', start_date)
    }
    if (end_date) {
      query = query.lte('start_at', end_date)
    }

    // Apply other filters
    if (event_type) query = query.eq('event_type', event_type)
    if (status) query = query.eq('status', status)
    if (search) query = query.ilike('title', `%${search}%`)

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events: data })
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
      start_at, 
      end_at,
      all_day = false,
      location,
      attendees = [],
      event_type = 'reminder',
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

    if (!start_at) {
      return NextResponse.json(
        { error: 'Start date is required' },
        { status: 400 }
      )
    }

    const startDate = new Date(start_at)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      )
    }

    let validatedEndAt = null
    if (end_at) {
      const endDate = new Date(end_at)
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid end date format' },
          { status: 400 }
        )
      }
      validatedEndAt = endDate.toISOString()
    }

    // Insert event into database
    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        start_at: startDate.toISOString(),
        end_at: validatedEndAt,
        all_day,
        location: location?.trim() || null,
        attendees: Array.isArray(attendees) ? attendees : [],
        event_type,
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
        { error: 'Failed to create event' },
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