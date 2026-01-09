import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Rate limiting cache (in production, use Redis)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

// Rate limiting: 100 requests per minute per user
const RATE_LIMIT = 100
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitCache.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitCache.set(userId, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false
  }
  
  userLimit.count++
  return true
}

// AI-powered reminder processing
function processReminderWithAI(title: string, notes?: string) {
  // Extract urgency keywords
  const urgencyKeywords = ['urgent', 'asap', 'immediately', 'critical', 'important', 'deadline']
  const isUrgent = urgencyKeywords.some(keyword => 
    title.toLowerCase().includes(keyword) || notes?.toLowerCase().includes(keyword)
  )
  
  // Extract time references
  const timePatterns = [
    { pattern: /(\d{1,2}):(\d{2})\s*(am|pm)/i, type: 'time' },
    { pattern: /(\d{1,2})\s*(am|pm)/i, type: 'time' },
    { pattern: /tomorrow/i, type: 'relative' },
    { pattern: /next week/i, type: 'relative' },
    { pattern: /this weekend/i, type: 'relative' },
    { pattern: /in (\d+)\s*(minutes?|hours?|days?)/i, type: 'relative' }
  ]
  
  const timeMatches = timePatterns.filter(({ pattern }) => pattern.test(title + (notes || '')))
  
  // Determine priority
  let priority = 'medium'
  if (isUrgent) priority = 'high'
  if (timeMatches.length === 0 && !isUrgent) priority = 'low'
  
  // Extract category
  const categoryKeywords = {
    'work': ['meeting', 'call', 'email', 'project', 'deadline', 'presentation'],
    'personal': ['family', 'mom', 'dad', 'friend', 'birthday', 'anniversary'],
    'health': ['doctor', 'appointment', 'medicine', 'exercise', 'gym'],
    'shopping': ['buy', 'purchase', 'grocery', 'store', 'shopping']
  }
  
  let category = 'general'
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => title.toLowerCase().includes(keyword))) {
      category = cat
      break
    }
  }
  
  return {
    priority,
    category,
    isUrgent,
    hasTimeReference: timeMatches.length > 0
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
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

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { title, due_at, notes } = body

    // Enhanced validation
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

    // AI-powered processing
    const aiProcessing = processReminderWithAI(title, notes)

    // Insert reminder into database with AI insights
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        title: title.trim(),
        due_at: validatedDueAt,
        notes: notes?.trim() || null,
        status: 'pending',
        priority: aiProcessing.priority,
        category: aiProcessing.category,
        metadata: {
          ai_processed: true,
          is_urgent: aiProcessing.isUrgent,
          has_time_reference: aiProcessing.hasTimeReference,
          created_via: 'quick_add'
        }
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

    // Performance metrics
    const processingTime = Date.now() - startTime
    
    // Return enhanced response with AI insights
    return NextResponse.json({
      ...data,
      ai_insights: {
        priority: aiProcessing.priority,
        category: aiProcessing.category,
        is_urgent: aiProcessing.isUrgent,
        processing_time_ms: processingTime
      }
    }, { 
      status: 201,
      headers: {
        'X-Processing-Time': processingTime.toString(),
        'X-AI-Processed': 'true'
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
