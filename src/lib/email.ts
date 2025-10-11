import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@remind.app',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      throw new Error('Failed to send email')
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to RE:MIND</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">Welcome to RE:MIND, ${name}!</h1>
            <p>Thank you for joining RE:MIND - the ultimate reminder app that never lets you miss important moments.</p>
            
            <h2>🚀 Getting Started</h2>
            <ul>
              <li>Create your first reminder using voice or text</li>
              <li>Set up push notifications for instant alerts</li>
              <li>Explore our smart categorization features</li>
              <li>Try our bulk operations for efficiency</li>
            </ul>
            
            <h2>💡 Pro Tips</h2>
            <ul>
              <li>Use natural language: "Call mom tomorrow at 3pm"</li>
              <li>Set up recurring reminders for regular tasks</li>
              <li>Use categories to organize your reminders</li>
              <li>Enable dark mode for comfortable viewing</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://remind.app/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Start Using RE:MIND
              </a>
            </div>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The RE:MIND Team</p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: email,
      subject: 'Welcome to RE:MIND! 🚀',
      html,
      text: `Welcome to RE:MIND, ${name}! Thank you for joining. Visit https://remind.app/dashboard to get started.`
    })
  }

  async sendReminderEmail(email: string, reminder: {
    title: string
    description?: string
    location?: string
    startDate: string
    category: string
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reminder: ${reminder.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">🔔 Reminder</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">${reminder.title}</h2>
              ${reminder.description ? `<p><strong>Description:</strong> ${reminder.description}</p>` : ''}
              ${reminder.location ? `<p><strong>Location:</strong> ${reminder.location}</p>` : ''}
              <p><strong>Time:</strong> ${new Date(reminder.startDate).toLocaleString()}</p>
              <p><strong>Category:</strong> ${reminder.category}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://remind.app/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View in RE:MIND
              </a>
            </div>
            
            <p>Best regards,<br>The RE:MIND Team</p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: email,
      subject: `🔔 Reminder: ${reminder.title}`,
      html,
      text: `Reminder: ${reminder.title}\n\n${reminder.description || ''}\n\nTime: ${new Date(reminder.startDate).toLocaleString()}\n\nView at: https://remind.app/dashboard`
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `https://remind.app/auth/reset-password?token=${resetToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - RE:MIND</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">🔒 Password Reset Request</h1>
            
            <p>You requested a password reset for your RE:MIND account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request this password reset, please ignore this email.</p>
            
            <p>Best regards,<br>The RE:MIND Team</p>
          </div>
        </body>
      </html>
    `

    await this.sendEmail({
      to: email,
      subject: 'Password Reset - RE:MIND',
      html,
      text: `Password Reset Request\n\nClick this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`
    })
  }
}

export const emailService = new EmailService()
