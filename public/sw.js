// SwasthyaMitra Service Worker — Rural PHC Offline Triage & Clinic Suite
// Cache Version: v1.0.0 (National Health Mission / Odisha Health Portal)

const CACHE_NAME = 'swasthyamitra-phc-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/cardiac_triage.jpg',
  '/images/respiratory_triage.jpg',
  '/images/maternal_triage.jpg',
  '/images/pediatric_triage.jpg',
  '/images/xray_hand.jpg',
  '/images/xray_skull.jpg',
  '/images/xray_chest_clinical.jpg',
  '/images/xray_knees.jpg'
];

// Install Event: Pre-cache critical App Shell & Medical References
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching Rural PHC Offline App Shell & X-Ray references');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some assets failed pre-caching:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate with Offline Cache Fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests or chrome-extension URLs
  if (req.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Handle SPA Navigation requests: Return cached index.html if offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Assets, images, and script bundles: Cache-First / Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background for fresh updates
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {
          // Silent catch for offline mode
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(req)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Return generic offline response for images if missing
          if (req.destination === 'image') {
            return caches.match('/images/cardiac_triage.jpg');
          }
          return new Response('Offline: SwasthyaMitra Rural PHC Cached Mode Active', {
            status: 503,
            statusText: 'Service Unavailable (Offline)'
          });
        });
    })
  );
});

// Background Sync Listener
self.addEventListener('sync', (event) => {
  if (event.tag === 'phc-outbox-sync') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_OUTBOX_SYNC', source: 'background_sync' });
        });
      })
    );
  }
});

// PostMessage interface for manual sync and status
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
