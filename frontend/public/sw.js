// Service Worker for Seek Learning Platform
// Handles offline caching and push notifications

const CACHE_NAME = 'seek-v1.0.0';
const STATIC_CACHE_NAME = 'seek-static-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// API routes to cache
const API_CACHE_PATTERNS = [
  '/api/v1/tutorials',
  '/api/v1/progress',
  '/api/v1/auth/me'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Cache API responses
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Cache opened');
        return cache;
      })
    ]).then(() => {
      console.log('Service Worker: Installed successfully');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first, then cache
    event.respondWith(networkFirstStrategy(request));
  } else if (isStaticAsset(url.pathname)) {
    // Static assets - cache first
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.pathname === '/' || isAppRoute(url.pathname)) {
    // App routes - serve index.html from cache, with network fallback
    event.respondWith(appShellStrategy(request));
  } else {
    // Other requests - network first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network first strategy (good for API calls)
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Network failed, serving from cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return createOfflinePage();
    }
    
    throw error;
  }
}

// Cache first strategy (good for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Failed to fetch and cache:', request.url);
    throw error;
  }
}

// App shell strategy (serve cached index.html for app routes)
async function appShellStrategy(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Check if the path is a static asset
function isStaticAsset(pathname) {
  return pathname.startsWith('/static/') ||
         pathname.includes('.') && !pathname.includes('/api/');
}

// Check if the path is an app route (SPA routes)
function isAppRoute(pathname) {
  const appRoutes = [
    '/dashboard',
    '/tutorials',
    '/playground',
    '/practice',
    '/profile',
    '/settings',
    '/achievements'
  ];
  
  return appRoutes.some(route => pathname.startsWith(route));
}

// Create offline page response
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Seek Learning Platform</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .logo {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 36px;
          font-weight: bold;
          color: #667eea;
        }
        h1 {
          margin: 0 0 16px 0;
          font-size: 24px;
          font-weight: 600;
        }
        p {
          margin: 0 0 24px 0;
          opacity: 0.9;
          line-height: 1.5;
        }
        .retry-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .features {
          margin-top: 32px;
          text-align: left;
        }
        .feature {
          display: flex;
          align-items: center;
          margin: 12px 0;
          opacity: 0.8;
          font-size: 14px;
        }
        .feature::before {
          content: '✓';
          margin-right: 8px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">S</div>
        <h1>You're Offline</h1>
        <p>Don't worry! You can still access some features of Seek while offline.</p>
        
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
        
        <div class="features">
          <div class="feature">View cached tutorials</div>
          <div class="feature">Access saved code snippets</div>
          <div class="feature">Continue learning offline</div>
          <div class="feature">Practice with local exercises</div>
        </div>
      </div>

      <script>
        // Auto-retry when connection is restored
        window.addEventListener('online', () => {
          setTimeout(() => window.location.reload(), 1000);
        });
        
        // Update UI based on connection status
        function updateConnectionStatus() {
          const isOnline = navigator.onLine;
          document.body.style.opacity = isOnline ? '1' : '0.8';
        }
        
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus();
      </script>
    </body>
    </html>
  `;

  return new Response(offlineHTML, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let notificationData = {
    title: 'Seek Learning Platform',
    body: 'You have a new notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'seek-notification',
    requireInteraction: false,
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Error parsing push notification data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  // Handle notification actions
  const action = event.action;
  const data = event.notification.data || {};

  let url = '/';
  
  if (action === 'code' || action === 'continue') {
    url = '/playground';
  } else if (action === 'view') {
    url = data.url || '/achievements';
  } else if (action === 'share') {
    // Handle sharing
    if (self.registration.share) {
      self.registration.share({
        title: 'Seek Learning Platform',
        text: 'Check out my progress on Seek!',
        url: 'https://seek-learning.com'
      });
    }
    return;
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            action,
            data,
            url
          });
          return;
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncUserProgress());
  } else if (event.tag === 'background-sync-code') {
    event.waitUntil(syncCodeExecutions());
  }
});

// Sync user progress when back online
async function syncUserProgress() {
  try {
    // Get offline progress data from IndexedDB or localStorage
    const progressData = await getOfflineProgressData();
    
    for (const progress of progressData) {
      try {
        await fetch('/api/v1/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress)
        });
        
        // Mark as synced
        await markProgressSynced(progress.id);
      } catch (error) {
        console.error('Failed to sync progress:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync code executions
async function syncCodeExecutions() {
  try {
    const codeData = await getOfflineCodeData();
    
    for (const code of codeData) {
      try {
        await fetch('/api/v1/code/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(code)
        });
        
        await markCodeSynced(code.id);
      } catch (error) {
        console.error('Failed to sync code execution:', error);
      }
    }
  } catch (error) {
    console.error('Code sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflineProgressData() {
  // Implementation would get data from IndexedDB
  return [];
}

async function markProgressSynced(id) {
  // Implementation would mark item as synced in IndexedDB
}

async function getOfflineCodeData() {
  // Implementation would get code data from IndexedDB
  return [];
}

async function markCodeSynced(id) {
  // Implementation would mark code as synced in IndexedDB
}

// Message handling
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
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
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

console.log('Service Worker: Script loaded successfully');