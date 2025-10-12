import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { authenticateRequest } from '@/lib/auth'
import { handleApiError } from '@/lib/errorHandler'

// Configure VAPID keys (only if they exist and are valid)
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

if (vapidPublicKey && vapidPrivateKey && 
    vapidPublicKey !== 'your-vapid-public-key' && 
    vapidPrivateKey !== 'your-vapid-private-key' &&
    vapidPublicKey.length > 50 && 
    vapidPrivateKey.length > 50) {
  try {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:admin@remind.app',
      vapidPublicKey,
      vapidPrivateKey
    )
  } catch (error) {
    console.warn('Failed to set VAPID details:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subscription, payload } = body

    if (!subscription || !payload) {
      return NextResponse.json(
        { error: 'Missing subscription or payload' },
        { status: 400 }
      )
    }

    // Send push notification
    const result = await webpush.sendNotification(subscription, JSON.stringify(payload))

    return NextResponse.json({ 
      success: true, 
      result: result.statusCode 
    })

  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return VAPID public key for client-side subscription
    return NextResponse.json({
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    })

  } catch (error) {
    return handleApiError(error)
  }
}
