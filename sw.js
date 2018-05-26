var CACHE_NAME = 'restaurant-cache-v5';
var urlsToCache = [
    "./",
    'js/main.js',
    'js/dbhelper.js',
    'js/restaurant_info.js',
    'data/restaurants.json',
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    console.log("installing ServiceWorker");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log("in activate");
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != CACHE_NAME
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('fetching...');

    event.respondWith(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.match(event.request)
                    .then(function (response) {
                        return response || fetch(event.request)
                            .then(function (response) {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                    });
            })
    );
});