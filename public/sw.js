// Service Worker for RE:MIND PWA
const CACHE_NAME = 'remind-v1.0.0'
const STATIC_CACHE = 'remind-static-v1'
const DYNAMIC_CACHE = 'remind-dynamic-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('SW: Installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('SW: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE
            })
            .map((cacheName) => {
              console.log('SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        console.log('SW: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same origin requests
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return fetch(request)
            .then((response) => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response
              }

              // Clone the response
              const responseToCache = response.clone()

              // Cache dynamic content
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache)
                })

              return response
            })
            .catch(() => {
              // Return offline page for navigation requests
              if (request.mode === 'navigate') {
                return caches.match('/offline.html')
              }
            })
        })
    )
  } else {
    // External requests (APIs, CDNs, etc.)
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request)
            .then((response) => {
              // Cache successful external responses
              if (response.status === 200) {
                const responseToCache = response.clone()
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseToCache)
                  })
              }
              return response
            })
        })
    )
  }
})

// Background sync for offline reminder creation
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-reminders') {
    event.waitUntil(syncReminders())
  }
})

// Push notifications for reminders
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'snooze',
          title: 'Snooze 10min',
          icon: '/icons/snooze.png'
        },
        {
          action: 'complete',
          title: 'Mark Done',
          icon: '/icons/check.png'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'snooze') {
    // Handle snooze action
    event.waitUntil(
      clients.openWindow('/?action=snooze&id=' + event.notification.data.primaryKey)
    )
  } else if (event.action === 'complete') {
    // Handle complete action
    event.waitUntil(
      clients.openWindow('/?action=complete&id=' + event.notification.data.primaryKey)
    )
  } else {
    // Default click - open app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Helper function for syncing reminders
async function syncReminders() {
  try {
    // Get pending reminders from IndexedDB
    const pendingReminders = await getPendingReminders()
    
    for (const reminder of pendingReminders) {
      try {
        // Attempt to sync with server
        await fetch('/api/reminders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reminder)
        })
        
        // Remove from pending if successful
        await removePendingReminder(reminder.id)
      } catch (error) {
        console.log('SW: Failed to sync reminder:', reminder.id)
      }
    }
  } catch (error) {
    console.log('SW: Background sync failed:', error)
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingReminders() {
  // Implementation would use IndexedDB
  return []
}

async function removePendingReminder(id) {
  // Implementation would use IndexedDB
  return Promise.resolve()
}
