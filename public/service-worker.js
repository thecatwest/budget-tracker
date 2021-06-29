// assign global constants
const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// define files to cache
const FILES_TO_CACHE = [
  "./index.html",
  "./css/styles.css",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png",
  "./js/index.js",
  "./service-worker.js",
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

// activate and set up for deleting previous caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    // caches.keys() will return a promise with keys array
    caches.keys().then(function (keylist) {
        // filter keylist and set keys as variable 
      let cacheKeeplist = keylist.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
    //   push cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

    // return caches.keys() promise
      return Promise.all(
        keylist.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) == -1) {
            console.log(`Removing previous cache : ${key}`);
            // delete cache using key
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// intercept the fetch req, respond w/ cached resources
self.addEventListener('fetch', function (e) {
    console.log(`fetch request : ${e.request.url}`)
    e.respondWith(
        // if the fetch request matches a cached resource key, respond by returning the request
      caches.match(e.request).then(function (request) {
        //   else, the request doesn't match a cached key, fetch a new cache with request and return it
        return request || fetch(e.request)
      })
    )
  })