const CACHE_NAME = 'family-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrX2iLw166xA.woff2'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For navigation requests (HTML), use Network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // For static assets (images, fonts, scripts), use Cache-first
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache new static assets on the fly
        if (
          event.request.url.includes('/assets/') || 
          event.request.url.includes('fonts.googleapis.com') ||
          event.request.url.includes('fonts.gstatic.com') ||
          event.request.url.includes('picsum.photos')
        ) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    })
  );
});
