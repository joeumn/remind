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
