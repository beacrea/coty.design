const VERSION = '1.2.0';
const CACHE_NAME = `askcoty-v${VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('askcoty-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (event.request.method !== 'GET') {
    return;
  }
  
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && !url.pathname.startsWith('/api/')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
