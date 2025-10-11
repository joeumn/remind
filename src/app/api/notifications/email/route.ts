import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { authenticateRequest } from '@/lib/auth'
import { handleApiError } from '@/lib/errorHandler'

// Create email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { to, subject, template, data } = body

    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject' },
        { status: 400 }
      )
    }

    // Generate email content based on template
    let html = ''
    let text = ''

    switch (template) {
      case 'reminder':
        html = generateReminderEmailHTML(data)
        text = generateReminderEmailText(data)
        break
      
      case 'welcome':
        html = generateWelcomeEmailHTML(data)
        text = generateWelcomeEmailText(data)
        break
      
      default:
        html = data.html || ''
        text = data.text || ''
    }

    // Send email
    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@remind.app',
      to,
      subject,
      html,
      text,
    })

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    })

  } catch (error) {
    return handleApiError(error)
  }
}

function generateReminderEmailHTML(data: any): string {
  const { event, reminderTime, priority } = data
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>RE:MIND - ${event.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .priority-urgent { background: #ff6b6b; }
        .priority-high { background: #ffa726; }
        .priority-medium { background: #66bb6a; }
        .priority-low { background: #42a5f5; }
        .priority-badge { color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 RE:MIND</h1>
          <p>Never forget anything again</p>
        </div>
        <div class="content">
          <h2>📅 ${event.title}</h2>
          <div class="event-details">
            <p><strong>⏰ Time:</strong> ${new Date(event.start_date).toLocaleString()}</p>
            ${event.location ? `<p><strong>📍 Location:</strong> ${event.location}</p>` : ''}
            ${event.description ? `<p><strong>📝 Description:</strong> ${event.description}</p>` : ''}
            <p><strong>🏷️ Category:</strong> ${event.category}</p>
            <span class="priority-badge priority-${priority.toLowerCase()}">${priority} Priority</span>
          </div>
          <p>This is your reminder for the event above. Don't forget to attend!</p>
          <a href="https://remind.app/dashboard" class="btn">View in RE:MIND</a>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateReminderEmailText(data: any): string {
  const { event, reminderTime, priority } = data
  
  return `
RE:MIND - ${event.title}

Time: ${new Date(event.start_date).toLocaleString()}
${event.location ? `Location: ${event.location}` : ''}
${event.description ? `Description: ${event.description}` : ''}
Category: ${event.category}
Priority: ${priority}

This is your reminder for the event above. Don't forget to attend!

View in RE:MIND: https://remind.app/dashboard
  `
}

function generateWelcomeEmailHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to RE:MIND</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to RE:MIND!</h1>
          <p>You'll never forget anything again</p>
        </div>
        <div class="content">
          <h2>Welcome to the future of productivity!</h2>
          <p>RE:MIND is your AI-powered assistant that makes it impossible to forget important events, meetings, and tasks.</p>
          <h3>🚀 Quick Start:</h3>
          <ul>
            <li>Use voice commands: "Hey Wanda, remind me to call mom tomorrow at 3pm"</li>
            <li>Instant capture: Tap the + button anywhere to quickly add reminders</li>
            <li>Smart scheduling: Let AI optimize your calendar for maximum productivity</li>
          </ul>
          <a href="https://remind.app/dashboard" class="btn">Start Using RE:MIND</a>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateWelcomeEmailText(data: any): string {
  return `
Welcome to RE:MIND!

You'll never forget anything again.

RE:MIND is your AI-powered assistant that makes it impossible to forget important events, meetings, and tasks.

Quick Start:
- Use voice commands: "Hey Wanda, remind me to call mom tomorrow at 3pm"
- Instant capture: Tap the + button anywhere to quickly add reminders  
- Smart scheduling: Let AI optimize your calendar for maximum productivity

Start using RE:MIND: https://remind.app/dashboard
  `
}
