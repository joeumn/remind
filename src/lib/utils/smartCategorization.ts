import { EventCategory } from '@/types'

  // Cache for category analysis results
const categoryCache = new Map<string, { category: EventCategory; confidence: number }>()

interface CategoryRule {
  keywords: string[]
  category: EventCategory
  confidence: number
  patterns?: RegExp[]
}

const categoryRules: CategoryRule[] = [
  {
    keywords: ['court', 'hearing', 'trial', 'judge', 'lawyer', 'attorney', 'legal', 'lawsuit', 'deposition', 'mediation'],
    category: 'Court',
    confidence: 0.9,
    patterns: [/court date/i, /hearing on/i, /trial begins/i]
  },
  {
    keywords: ['meeting', 'conference', 'presentation', 'client', 'project', 'deadline', 'report', 'business', 'office', 'work'],
    category: 'Work',
    confidence: 0.85,
    patterns: [/meeting with/i, /client call/i, /project deadline/i]
  },
  {
    keywords: ['family', 'mom', 'dad', 'kids', 'children', 'spouse', 'wedding', 'birthday', 'anniversary', 'visit'],
    category: 'Family',
    confidence: 0.9,
    patterns: [/call mom/i, /pick up kids/i, /family dinner/i]
  },
  {
    keywords: ['doctor', 'dentist', 'medical', 'appointment', 'health', 'gym', 'exercise', 'therapy', 'checkup'],
    category: 'Recovery',
    confidence: 0.85,
    patterns: [/doctor appointment/i, /dentist visit/i, /gym session/i]
  },
  {
    keywords: ['personal', 'hobby', 'read', 'learn', 'study', 'course', 'travel', 'vacation', 'shopping', 'errands'],
    category: 'Personal',
    confidence: 0.8,
    patterns: [/read book/i, /grocery shopping/i, /personal time/i]
  }
]

export function analyzeTextForCategory(text: string): { category: EventCategory; confidence: number } {
  // Check cache first for performance
  if (categoryCache.has(text)) {
    return categoryCache.get(text)!
  }

  const normalizedText = text.toLowerCase()
  let bestMatch = { category: 'Other' as EventCategory, confidence: 0.3 }

  for (const rule of categoryRules) {
    let matchScore = 0
    let matchCount = 0

    // Check keywords
    for (const keyword of rule.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matchScore += 1
        matchCount++
      }
    }

    // Check regex patterns
    if (rule.patterns) {
      for (const pattern of rule.patterns) {
        if (pattern.test(text)) {
          matchScore += 2 // Patterns get higher weight
          matchCount++
        }
      }
    }

    if (matchCount > 0) {
      const confidence = Math.min(0.95, rule.confidence * (matchScore / Math.max(1, matchCount)))
      if (confidence > bestMatch.confidence) {
        bestMatch = { category: rule.category, confidence }
      }
    }
  }

  // Cache the result for future use
  categoryCache.set(text, bestMatch)
  
  // Limit cache size to prevent memory leaks
  if (categoryCache.size > 1000) {
    const firstKey = categoryCache.keys().next().value
    categoryCache.delete(firstKey)
  }
  
  return bestMatch
}

export function suggestCategoryFromContext(
  text: string,
  timeOfDay?: number,
  dayOfWeek?: number
): { category: EventCategory; confidence: number; reasoning?: string } {
  const baseAnalysis = analyzeTextForCategory(text)
  
  // Time-based adjustments
  if (timeOfDay !== undefined) {
    const hour = new Date().getHours()
    
    // Early morning (6-9 AM) - likely personal/recovery activities
    if (hour >= 6 && hour < 9) {
      if (baseAnalysis.category === 'Personal' || baseAnalysis.category === 'Recovery') {
        baseAnalysis.confidence += 0.1
        baseAnalysis.reasoning = 'Early morning activities'
      }
    }
    
    // Work hours (9-17) - likely work activities
    if (hour >= 9 && hour < 17) {
      if (baseAnalysis.category === 'Work') {
        baseAnalysis.confidence += 0.15
        baseAnalysis.reasoning = 'Business hours'
      }
    }
    
    // Evening (17-21) - likely family/personal
    if (hour >= 17 && hour < 21) {
      if (baseAnalysis.category === 'Family' || baseAnalysis.category === 'Personal') {
        baseAnalysis.confidence += 0.1
        baseAnalysis.reasoning = 'Evening time'
      }
    }
  }

  // Day-based adjustments
  if (dayOfWeek !== undefined) {
    // Weekends - more likely personal/family
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      if (baseAnalysis.category === 'Family' || baseAnalysis.category === 'Personal') {
        baseAnalysis.confidence += 0.1
        baseAnalysis.reasoning = 'Weekend activities'
      }
    }
  }

  return baseAnalysis
}

export function getCategoryEmoji(category: EventCategory): string {
  const emojis = {
    Court: '⚖️',
    Work: '💼',
    Family: '👨‍👩‍👧‍👦',
    Personal: '🎯',
    Recovery: '🏥',
    Other: '📝'
  }
  return emojis[category]
}

export function getCategoryDescription(category: EventCategory): string {
  const descriptions = {
    Court: 'Legal and court-related activities',
    Work: 'Professional and business activities',
    Family: 'Family and personal relationships',
    Personal: 'Personal development and hobbies',
    Recovery: 'Health, wellness, and medical',
    Other: 'General activities and miscellaneous'
  }
  return descriptions[category]
}
