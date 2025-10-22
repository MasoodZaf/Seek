// Service Worker for Seek Learning Platform
// Provides caching, offline functionality, and performance optimization

const CACHE_NAME = 'seek-v1.0.0';
const STATIC_CACHE = 'seek-static-v1.0.0';
const DYNAMIC_CACHE = 'seek-dynamic-v1.0.0';
const API_CACHE = 'seek-api-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo.svg'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/tutorials',
  '/api/user/profile',
  '/api/user/progress'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    // Static assets - cache first
    event.respondWith(handleStaticAsset(request));
  } else if (url.pathname.startsWith('/static/')) {
    // Static files - cache first
    event.respondWith(handleStaticAsset(request));
  } else {
    // HTML pages - stale while revalidate
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cacheName = API_CACHE;
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature is not available offline'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cacheName = STATIC_CACHE;
  
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset', error);
    
    // Return a fallback response or throw
    throw error;
  }
}

// Handle page requests with stale-while-revalidate strategy
async function handlePageRequest(request) {
  const cacheName = DYNAMIC_CACHE;
  
  // Get from cache
  const cachedResponse = await caches.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        // Update cache in background
        caches.open(cacheName)
          .then((cache) => cache.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('Service Worker: Network request failed', error);
      return null;
    });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response if no cache
  const networkResponse = await networkResponsePromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Return offline page as fallback
  return caches.match('/offline.html') || new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Offline - Seek Learning Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
          }
          .container {
            max-width: 400px;
            padding: 2rem;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h1 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
          }
          p {
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          button {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
          }
          button:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📚</div>
          <h1>You're Offline</h1>
          <p>It looks like you're not connected to the internet. Some features may not be available.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  try {
    // Get pending actions from IndexedDB or localStorage
    // Sync user progress, code saves, etc.
    console.log('Service Worker: Performing background sync');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action clicks
    console.log('Notification action clicked:', event.action);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

// Utility function to clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.respondWith(
    handleRequest(event.request).then((response) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow requests
      if (duration > 1000) {
        console.log(`Service Worker: Slow request detected: ${event.request.url} (${duration}ms)`);
      }
      
      return response;
    })
  );
});

// Generic request handler
async function handleRequest(request) {
  // This would be called by the specific handlers above
  // Keeping it simple for now
  return fetch(request);
}