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

          // Listen for updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New content is available; please refresh.');
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
