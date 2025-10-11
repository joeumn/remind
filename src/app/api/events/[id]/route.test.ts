import { NextRequest } from 'next/server'
import { GET, PUT, DELETE } from './route'
import { authenticateRequest } from '@/lib/auth'
import { apiRateLimit } from '@/lib/rateLimit'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/rateLimit')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    event: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<typeof authenticateRequest>
const mockApiRateLimit = apiRateLimit as jest.MockedFunction<typeof apiRateLimit>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/events/[id]', () => {
  const mockAuth = { userId: 'user-123', email: 'test@example.com' }
  const mockEvent = {
    id: 'event-123',
    userId: 'user-123',
    title: 'Test Event',
    description: 'Test Description',
    category: 'Personal',
    priority: 'Medium',
    startDate: new Date('2024-01-01T10:00:00Z'),
    endDate: new Date('2024-01-01T11:00:00Z'),
    isAllDay: false,
    location: 'Test Location',
    recurrenceType: 'None',
    recurrencePattern: null,
    prepTasks: [],
    metadata: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockApiRateLimit.mockReturnValue({
      success: true,
      headers: {
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': '999',
        'X-RateLimit-Reset': '1234567890',
      },
    })
  })

  describe('GET /api/events/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      mockAuthenticateRequest.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events/event-123')
      const response = await GET(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should return 404 when event not found', async () => {
      mockAuthenticateRequest.mockResolvedValue(mockAuth)
      mockPrisma.event.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events/nonexistent')
      const response = await GET(request, { params: { id: 'nonexistent' } })

      expect(response.status).toBe(404)
      const body = await response.json()
      expect(body.error).toBe('Event not found')
    })

    it('should return event when authenticated and event exists', async () => {
      mockAuthenticateRequest.mockResolvedValue(mockAuth)
      mockPrisma.event.findFirst.mockResolvedValue(mockEvent)

      const request = new NextRequest('http://localhost:3000/api/events/event-123')
      const response = await GET(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual(mockEvent)
    })

    it('should return 429 when rate limited', async () => {
      mockApiRateLimit.mockReturnValue({
        success: false,
        info: {
          limit: 1000,
          remaining: 0,
          reset: Date.now() + 900000,
          retryAfter: 900,
        },
        headers: {
          'X-RateLimit-Limit': '1000',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': '1234567890',
          'Retry-After': '900',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/events/event-123')
      const response = await GET(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(429)
      const body = await response.json()
      expect(body.error).toBe('Rate limit exceeded')
    })
  })

  describe('PUT /api/events/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      mockAuthenticateRequest.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events/event-123', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
      })
      const response = await PUT(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should return 404 when event not found', async () => {
      mockAuthenticateRequest.mockResolvedValue(mockAuth)
      mockPrisma.event.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events/nonexistent', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
      })
      const response = await PUT(request, { params: { id: 'nonexistent' } })

      expect(response.status).toBe(404)
      const body = await response.json()
      expect(body.error).toBe('Event not found')
    })

    it('should update event when authenticated and event exists', async () => {
      const updatedEvent = { ...mockEvent, title: 'Updated Title' }
      mockAuthenticateRequest.mockResolvedValue(mockAuth)
      mockPrisma.event.findFirst.mockResolvedValue(mockEvent)
      mockPrisma.event.update.mockResolvedValue(updatedEvent)

      const request = new NextRequest('http://localhost:3000/api/events/event-123', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
      })
      const response = await PUT(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.title).toBe('Updated Title')
      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 'event-123' },
        data: expect.objectContaining({
          title: 'Updated Title',
          updatedAt: expect.any(Date),
        }),
      })
    })
  })

  describe('DELETE /api/events/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      mockAuthenticateRequest.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events/event-123', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should return 404 when event not found', async () => {
      mockAuthenticateRequest.mockResolvedValue(mockAuth)
      mockPrisma.event.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events/nonexistent', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: 'nonexistent' } })

      expect(response.status).toBe(404)
      const body = await response.json()
      expect(body.error).toBe('Event not found')
    })

    it('should soft delete event when authenticated and event exists', async () => {
      mockAuthenticateRequest.mockResolvedValue(mockAuth)
      mockPrisma.event.findFirst.mockResolvedValue(mockEvent)
      mockPrisma.event.update.mockResolvedValue({ ...mockEvent, status: 'deleted' })

      const request = new NextRequest('http://localhost:3000/api/events/event-123', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: 'event-123' } })

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.success).toBe(true)
      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 'event-123' },
        data: {
          status: 'deleted',
          updatedAt: expect.any(Date),
        },
      })
    })
  })
})
