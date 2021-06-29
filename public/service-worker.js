// assign global constants
const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// define files to cache
const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './js/index.js',
    './service-worker.js'
];

// set up for resource caching
self.addEventListener("install", function (e) {
    // Use e.waitUntil to tell browser to wait until work is complete before terminating service worker
    e.waitUntil(
      // use caches.open to find specific cache by name, then add every file in FILES_TO_CACHE array to the cache
      caches.open(CACHE_NAME).then(function (cache) {
        console.log("installing cache : " + CACHE_NAME);
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  });

// set up for deleting previous caches
