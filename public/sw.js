// Catholic Missal Service Worker
// Provides offline functionality for liturgical readings

const CACHE_NAME = 'catholic-missal-v1';
const STATIC_CACHE_NAME = 'catholic-missal-static-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/manifest.json',
  // Add other static assets as needed
];

// Cache strategies
const CACHE_STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// URL patterns and their cache strategies
const CACHE_RULES = [
  {
    pattern: /^\/api\/readings\/.+$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: 'readings-cache',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  {
    pattern: /\.(js|css|html)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'static-resources',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  {
    pattern: /\.(jpg|jpeg|png|gif|svg|webp)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: 'images',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete outdated caches
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip requests to different origins
  if (url.origin !== location.origin) {
    return;
  }

  // Find matching cache rule
  const rule = CACHE_RULES.find(rule => rule.pattern.test(url.pathname));

  if (rule) {
    event.respondWith(handleCacheStrategy(request, rule));
  } else {
    // Default to network first for unmatched requests
    event.respondWith(
      fetch(request)
        .catch(() => {
          // If network fails, try to serve from any cache
          return caches.match(request);
        })
    );
  }
});

// Cache strategy implementations
async function handleCacheStrategy(request, rule) {
  const cache = await caches.open(rule.cacheName);

  switch (rule.strategy) {
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return handleNetworkFirst(request, cache, rule);

    case CACHE_STRATEGIES.CACHE_FIRST:
      return handleCacheFirst(request, cache, rule);

    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return handleStaleWhileRevalidate(request, cache, rule);

    default:
      return handleNetworkFirst(request, cache, rule);
  }
}

// Network first strategy - good for API calls
async function handleNetworkFirst(request, cache, rule) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Check if cached response is still valid
      const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
      const now = new Date();

      if (now - cacheDate < rule.maxAge) {
        return cachedResponse;
      }
    }

    // Return offline fallback for readings API
    if (request.url.includes('/api/readings/')) {
      return createOfflineFallback(request);
    }

    throw error;
  }
}

// Cache first strategy - good for static assets
async function handleCacheFirst(request, cache, rule) {
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cached response is still valid
    const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
    const now = new Date();

    if (now - cacheDate < rule.maxAge) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate - good for frequently updated resources
async function handleStaleWhileRevalidate(request, cache, rule) {
  const cachedResponse = await cache.match(request);

  // Always try to update cache in the background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Silently fail background updates
    });

  if (cachedResponse) {
    // Return cached response immediately, update in background
    return cachedResponse;
  }

  // No cache, wait for network
  return fetchPromise;
}

// Create offline fallback response for readings
function createOfflineFallback(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const date = pathParts[pathParts.length - 1];

  const fallbackData = {
    error: 'Offline - Unable to fetch readings',
    fallback: {
      date: date,
      liturgicalDate: 'Offline Mode',
      season: 'Ordinary Time',
      color: 'green',
      rank: 'weekday',
      firstReading: {
        title: 'Reading Unavailable',
        citation: 'Please connect to the internet',
        text: 'Liturgical readings are not available while offline. Please check your internet connection and try again.',
      },
      psalm: {
        title: 'Responsorial Psalm Unavailable',
        citation: 'Please connect to the internet',
        text: 'Psalm reading is not available while offline.',
        response: 'Lord, hear our prayer.',
      },
      gospel: {
        title: 'Gospel Unavailable',
        citation: 'Please connect to the internet',
        text: 'Gospel reading is not available while offline. Please check your internet connection and try again.',
      },
    },
  };

  return new Response(JSON.stringify(fallbackData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Offline-Fallback': 'true',
    },
  });
}

// Handle background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'readings-sync') {
    event.waitUntil(syncFailedReadings());
  }
});

// Sync failed readings requests
async function syncFailedReadings() {
  // This would be implemented to retry failed requests
  // when the device comes back online
  console.log('[SW] Syncing failed readings requests...');
}

// Handle push notifications (for future expansion)
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', event);

  // This could be used for daily reading notifications
  // or important liturgical celebrations
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});