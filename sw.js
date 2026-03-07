// Versioning: Change this number whenever you update your game files
const CACHE_NAME = 'guess-the-number-v21.7';

// List every file you want to be available offline
const ASSETS = [
  '/',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './favicon.svg',
  './cat.svg',
  './happy-happy-happy-song.mp3',
];

// 1. Install: The Service Worker saves your files to the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate: Clean up old versions if you update the game
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch: The "Brain" that serves files from the cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. If we have it in cache, return it
      if (cachedResponse) return cachedResponse;

      // 2. Otherwise, fetch it
      return fetch(event.request).then((networkResponse) => {
        // 3. Only cache successful responses (status 200)
        // This avoids caching partial 206 responses
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
