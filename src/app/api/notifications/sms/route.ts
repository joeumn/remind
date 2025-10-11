import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { handleApiError } from '@/lib/errorHandler'

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      )
    }

    // In a real implementation, you would integrate with Twilio or similar SMS service
    // For now, we'll simulate the SMS sending
    console.log(`SMS sent to ${to}: ${message}`)
    
    // Example Twilio integration:
    /*
    const twilio = require('twilio')
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })
    */

    return NextResponse.json({ 
      success: true, 
      messageId: `sms-${Date.now()}` // In real implementation, use actual message ID
    })

  } catch (error) {
    return handleApiError(error)
  }
}

// Helper function to format SMS message for reminders
export function formatReminderSMS(event: any): string {
  const eventTime = new Date(event.start_date).toLocaleString()
  const location = event.location ? ` at ${event.location}` : ''
  
  return `RE:MIND: ${event.title} - ${eventTime}${location}. Don't forget! Reply STOP to opt out.`
}

// Helper function to format SMS message for urgent reminders
export function formatUrgentSMS(event: any): string {
  const eventTime = new Date(event.start_date).toLocaleString()
  
  return `🚨 URGENT: ${event.title} - ${eventTime}. This is time-sensitive!`
}
