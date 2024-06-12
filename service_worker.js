var cacheName = 'Top Performance Fitness';
var filesToCache = [
  '/',
  '/index.html',
  '/memberships.html',
  '/programmes.html',
  '/staff.html',
  '/style.css',
  '/script.js'
];

// Cache contents when Offline See Cache
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Serve cached content when offline, examine Cache Storage
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});