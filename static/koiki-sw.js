const CACHE = 'koiki';

const TARGETS = [
  new RegExp(`/${navigator.language}$`),
  /\.js$/,
  /\.css$/,
  /\.woff$/,
  /\.woff2$/,
  /\.tff$/,
  /\.png$/,
  /\.jpg$/,
];

function fromCache(request) {
  return caches.open(CACHE).then(cache =>
    cache.match(request.clone()).then((matching) => {
      if (matching) {
        console.log(`[ServiceWorker] Response from cache ${request.url}`);
      }
      return matching;
    })
  );
}


function updateCache(request, response) {
  return caches.open(CACHE).then(cache =>
      cache.put(request, response)
  );
}

function fromServer(request) {
  return fetch(request.clone()).then((response) => {
    const shouldCache = TARGETS.filter(target =>
      target.test(request.url)
    ).length !== 0;
    if (shouldCache) {
      console.log(`[ServiceWorker] Cache requst ${request.url}`);
      return updateCache(request, response.clone()).then(() => response);
    }
    return response;
  });
}

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] installed.');
  evt.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        './'
      ])
    )
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
  console.log(`[ServiceWorker] Serving the asset. ${evt.request.url}`);
  evt.respondWith(
    fromCache(evt.request).then(response => response || fromServer(evt.request)));
});
