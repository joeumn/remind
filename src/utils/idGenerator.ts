/**
 * Generate unique IDs for events and other entities
 * Combines timestamp with random string to ensure uniqueness
 */

let idCounter = 0

export function generateUniqueId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const counter = (++idCounter).toString(36)
  
  return `${timestamp}-${random}-${counter}`
}

export function generateEventId(): string {
  return generateUniqueId()
}

export function generateUserId(): string {
  return generateUniqueId()
}

/**
 * Validate if an ID is properly formatted
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && id.includes('-')
}

/**
 * Extract timestamp from generated ID
 */
export function getTimestampFromId(id: string): number | null {
  const parts = id.split('-')
  const timestamp = parseInt(parts[0], 10)
  
  return isNaN(timestamp) ? null : timestamp
}
