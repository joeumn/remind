import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userId = 'demo-user' // Extract from JWT

    const subscription = await request.json()

    // In production, save subscription to database
    // For now, we'll just log it
    console.log('Push subscription received:', {
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys
    })

    // In production, you would:
    // 1. Save subscription to database
    // 2. Associate with user account
    // 3. Store for sending notifications later

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
