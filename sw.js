// Versioning: Change this number whenever you update your game files
const CACHE_NAME = 'guess-the-number-v21.7';

// List every file you want to be available offline
const ASSETS = [
  '/',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './favicon.svg'
  './website.png',
  './cat.svg',
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
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from internet if not found
      return response || fetch(event.request);
    })
  );
});
