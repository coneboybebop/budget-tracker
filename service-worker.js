const FILES_TO_CACHE= [
    "./public/css/styles.css",
    "./public/js/idb.js",
    "./public/js/index.js",
    "./public/index.html",
];

const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME= APP_PREFIX + VERSION;

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )

})