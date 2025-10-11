import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      services: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        external_apis: await checkExternalAPIs()
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }

    const isHealthy = Object.values(healthCheck.services).every(
      service => service.status === 'healthy'
    )

    return NextResponse.json(healthCheck, {
      status: isHealthy ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}

async function checkDatabase() {
  try {
    // In production, you'd check actual database connection
    // const client = new Client({ connectionString: process.env.DATABASE_URL })
    // await client.connect()
    // await client.query('SELECT 1')
    // await client.end()
    
    return {
      status: 'healthy',
      response_time: Math.random() * 100, // Mock response time
      last_check: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database connection failed',
      last_check: new Date().toISOString()
    }
  }
}

async function checkRedis() {
  try {
    // In production, you'd check Redis connection
    // const redis = new Redis(process.env.REDIS_URL)
    // await redis.ping()
    // await redis.quit()
    
    return {
      status: 'healthy',
      response_time: Math.random() * 50,
      last_check: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Redis connection failed',
      last_check: new Date().toISOString()
    }
  }
}

async function checkExternalAPIs() {
  const apis = [
    {
      name: 'Google Calendar API',
      url: 'https://www.googleapis.com/calendar/v3',
      status: 'healthy' // Mock status
    },
    {
      name: 'Push Notification Service',
      url: 'https://fcm.googleapis.com/fcm/send',
      status: 'healthy' // Mock status
    }
  ]

  return {
    status: apis.every(api => api.status === 'healthy') ? 'healthy' : 'degraded',
    services: apis
  }
}
