// Simple service worker for offline support
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('yahudim-app-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.generated.css',
        '/assets/index-D4sASlS8.js',
        '/manifest.json',
        // Add more assets as needed
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== 'yahudim-app-v1').map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
