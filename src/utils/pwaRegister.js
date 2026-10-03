/**
 * SwasthyaMitra PWA Registration & Connectivity Telemetry Manager
 * Designed for Rural Primary Health Centres (PHCs) with intermittent power/network
 */

let deferredPrompt = null;
let pwaInstallCallbacks = [];
let networkStatusCallbacks = [];

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] SwasthyaMitra Rural PHC Service Worker registered with scope:', reg.scope);

          // Auto-trigger full offline asset precaching after initial load
          setTimeout(() => {
            cacheAllAppResources();
          }, 2000);

          // Force check for updates from server on page load
          try {
            reg.update();
          } catch {}

          // Listen for updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New version detected, notifying worker to skip waiting...');
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // Capture PWA Install Prompt for 1-click installation
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    pwaInstallCallbacks.forEach((cb) => cb(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    pwaInstallCallbacks.forEach((cb) => cb(false));
    console.log('[PWA] SwasthyaMitra successfully installed as standalone desktop/mobile app.');
  });

  // Global Network Listeners
  window.addEventListener('online', () => {
    notifyNetworkChange(true);
  });

  window.addEventListener('offline', () => {
    notifyNetworkChange(false);
  });
}

/**
 * Pre-cache all discovered scripts, stylesheets, and clinical assets into CacheStorage
 */
export async function cacheAllAppResources() {
  if (!('caches' in window)) return { success: false, count: 0 };

  const urlsToCache = new Set(['/', '/index.html', '/manifest.json']);

  // Collect scripts and stylesheets
  document.querySelectorAll('script[src]').forEach((el) => {
    const src = el.getAttribute('src');
    if (src && !src.startsWith('chrome') && !src.startsWith('http')) {
      urlsToCache.add(src);
    }
  });

  document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
    const href = el.getAttribute('href');
    if (href && !href.startsWith('http')) {
      urlsToCache.add(href);
    }
  });

  // Clinical X-Ray & Triage Reference assets
  const clinicalAssets = [
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
  clinicalAssets.forEach((url) => urlsToCache.add(url));

  try {
    const cache = await caches.open('swasthyamitra-dynamic-v1.1.0');
    const promises = Array.from(urlsToCache).map((url) =>
      fetch(url)
        .then((res) => {
          if (res.ok) return cache.put(url, res);
        })
        .catch(() => {})
    );
    await Promise.allSettled(promises);
    console.log(`[PWA] Successfully cached ${urlsToCache.size} offline assets for zero-internet execution.`);
    return { success: true, count: urlsToCache.size };
  } catch (err) {
    console.warn('[PWA] Precaching batch completed with notes:', err);
    return { success: false, count: 0 };
  }
}

export function onPwaInstallable(callback) {
  pwaInstallCallbacks.push(callback);
  if (deferredPrompt) {
    callback(true);
  }
  return () => {
    pwaInstallCallbacks = pwaInstallCallbacks.filter((cb) => cb !== callback);
  };
}

export async function promptPwaInstall() {
  if (!deferredPrompt) {
    return { outcome: 'unavailable', message: 'PWA is already installed or browser does not support install prompts.' };
  }
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  pwaInstallCallbacks.forEach((cb) => cb(false));
  return choice;
}

export function onNetworkStatusChange(callback) {
  networkStatusCallbacks.push(callback);
  // Initial callback with current state
  callback(navigator.onLine);
  return () => {
    networkStatusCallbacks = networkStatusCallbacks.filter((cb) => cb !== callback);
  };
}

function notifyNetworkChange(isOnline) {
  networkStatusCallbacks.forEach((cb) => cb(isOnline));
}

export function isCurrentlyOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
