const cacheName = 'guess-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/favicon.svg'
];

// Install the service worker and cache the game code
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

// Fetch the game from the cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
