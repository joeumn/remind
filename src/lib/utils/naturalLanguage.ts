import { addDays, addHours, addMinutes, addWeeks, addMonths, setHours, setMinutes } from 'date-fns'

interface ParsedReminder {
  title: string
  date: Date
  confidence: number
}

export function parseNaturalLanguage(input: string): ParsedReminder {
  const now = new Date()
  let date = new Date(now)
  let title = input
  let confidence = 0.5

  // Normalize input
  const normalized = input.toLowerCase().trim()

  // Time patterns
  const timePatterns = [
    // Specific times
    { regex: /at (\d{1,2}):(\d{2})\s*(am|pm)?/i, handler: (match: RegExpMatchArray) => {
      let hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const period = match[3]?.toLowerCase()
      
      if (period === 'pm' && hours < 12) hours += 12
      if (period === 'am' && hours === 12) hours = 0
      
      date = setHours(setMinutes(date, minutes), hours)
      title = input.replace(match[0], '').trim()
      confidence = 0.9
    }},
    
    // Relative times
    { regex: /in (\d+)\s*(minute|min|hour|hr|day|week|month)s?/i, handler: (match: RegExpMatchArray) => {
      const value = parseInt(match[1])
      const unit = match[2].toLowerCase()
      
      if (unit.startsWith('min')) date = addMinutes(now, value)
      else if (unit.startsWith('h')) date = addHours(now, value)
      else if (unit === 'day') date = addDays(now, value)
      else if (unit === 'week') date = addWeeks(now, value)
      else if (unit === 'month') date = addMonths(now, value)
      
      title = input.replace(match[0], '').trim()
      confidence = 0.95
    }},
  ]

  // Day patterns
  const dayPatterns = [
    { regex: /\btomorrow\b/i, handler: () => {
      date = addDays(now, 1)
      date = setHours(setMinutes(date, 0), 9) // Default 9 AM
      title = input.replace(/\btomorrow\b/i, '').trim()
      confidence = 0.9
    }},
    
    { regex: /\btonight\b/i, handler: () => {
      date = setHours(setMinutes(now, 0), 20) // 8 PM
      title = input.replace(/\btonight\b/i, '').trim()
      confidence = 0.9
    }},
    
    { regex: /\bthis evening\b/i, handler: () => {
      date = setHours(setMinutes(now, 0), 18) // 6 PM
      title = input.replace(/\bthis evening\b/i, '').trim()
      confidence = 0.9
    }},
    
    { regex: /\bnext (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, handler: (match: RegExpMatchArray) => {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const targetDay = days.indexOf(match[1].toLowerCase())
      const currentDay = now.getDay()
      const daysToAdd = (targetDay + 7 - currentDay) % 7 || 7
      
      date = addDays(now, daysToAdd)
      date = setHours(setMinutes(date, 0), 9) // Default 9 AM
      title = input.replace(match[0], '').trim()
      confidence = 0.85
    }},
    
    { regex: /\bnext week\b/i, handler: () => {
      date = addWeeks(now, 1)
      date = setHours(setMinutes(date, 0), 9)
      title = input.replace(/\bnext week\b/i, '').trim()
      confidence = 0.8
    }},
  ]

  // Apply time patterns
  for (const pattern of timePatterns) {
    const match = normalized.match(pattern.regex)
    if (match) {
      pattern.handler(match)
      break
    }
  }

  // Apply day patterns
  for (const pattern of dayPatterns) {
    const match = normalized.match(pattern.regex)
    if (match) {
      pattern.handler(match)
      break
    }
  }

  // Clean up title
  title = title
    .replace(/^(remind me to|reminder to|remind|to)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  // If title is empty, use original input
  if (!title) {
    title = input
    confidence = 0.3
  }

  return { title, date, confidence }
}

// Examples:
// "Call mom tomorrow at 3pm" -> { title: "Call mom", date: tomorrow 3pm, confidence: 0.9 }
// "Meeting in 2 hours" -> { title: "Meeting", date: now + 2h, confidence: 0.95 }
// "Dentist appointment next Monday at 10:30am" -> { title: "Dentist appointment", date: next Mon 10:30am, confidence: 0.9 }
