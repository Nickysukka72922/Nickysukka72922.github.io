// Versioning: Change this number whenever you update your game files
const CACHE_NAME = 'guess-the-number-v22.4';

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
  self.skipWaiting();
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

self.addEventListener('fetch', (event) => {
  // If the request is for the music, ignore it and let the network handle it
  if (event.request.url.includes('.mp3')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
