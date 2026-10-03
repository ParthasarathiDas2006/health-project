// SwasthyaMitra Service Worker — Ultra-Reliable Rural PHC Offline Triage & Clinic Suite
// Version: v2.1.0 (Odisha Health Portal & ABDM Mission - Network-First for Fast Deployments)

const CACHE_NAME = 'swasthyamitra-phc-v2.1.0';
const DYNAMIC_CACHE_NAME = 'swasthyamitra-dynamic-v2.1.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Oriya:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  '/images/cardiac_triage.jpg',
  '/images/respiratory_triage.jpg',
  '/images/maternal_triage.jpg',
  '/images/pediatric_triage.jpg',
  '/images/xray_hand.jpg',
  '/images/xray_skull.jpg',
  '/images/xray_chest_clinical.jpg',
  '/images/xray_knees.jpg',
  '/images/xray_normal.jpg',
  '/images/xray_pneumonia.jpg',
  '/images/xray_tb.jpg',
  '/images/xray_fullbody.jpg'
];

// Install Event: Cache core static assets fault-tolerantly & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker v2.1.0] Pre-caching Rural PHC Offline Shell & Clinical Assets...');
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('[ServiceWorker] Note: Optional asset cached lazily:', asset);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up all outdated cache versions immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('[ServiceWorker] Purging obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network-First for HTML/JS/CSS to ensure instant updates, Cache-Fallback for Offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests or browser internal protocols
  if (req.method !== 'GET' || url.protocol.startsWith('chrome-extension') || url.protocol.startsWith('about')) {
    return;
  }

  // 1. HTML Navigation Requests & JS/CSS Scripts (Network-First Strategy)
  const isHtmlOrScript =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    req.destination === 'script' ||
    req.destination === 'style' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname === '/';

  if (isHtmlOrScript) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(req, copy);
              if (req.mode === 'navigate' || url.pathname === '/') {
                cache.put('/index.html', copy.clone());
              }
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed: return cached copy if available
          const cachedResponse =
            (await caches.match(req)) ||
            (await caches.match('/index.html')) ||
            (await caches.match('/'));
          if (cachedResponse) return cachedResponse;

          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head><meta charset="UTF-8"><title>SwasthyaMitra Offline Mode</title></head>
              <body style="font-family:sans-serif;padding:2rem;text-align:center;background:#0f172a;color:#f8fafc;">
                <h2>📡 SwasthyaMitra Rural PHC — Offline Active</h2>
                <p>You are working offline with IndexedDB. Please reconnect to sync.</p>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Images & Other Media: Stale-While-Revalidate / Cache-First
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(req, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(req)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          if (req.destination === 'image') {
            const fallbackImg = await caches.match('/images/cardiac_triage.jpg');
            if (fallbackImg) return fallbackImg;
          }
          return new Response('Offline resource unavailable', {
            status: 503,
            statusText: 'Offline Resource Unavailable'
          });
        });
    })
  );
});

// Background Sync Listener for queued PHC mutations
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

// Message listener for skip waiting & manual precaching trigger
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'PRECACHE_URLS' && Array.isArray(event.data.urls)) {
    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      event.data.urls.forEach((url) => {
        cache.add(url).catch((err) => console.log('[ServiceWorker] Precache url error:', url, err));
      });
    });
  }
});
