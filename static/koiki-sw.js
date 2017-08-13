const CACHE = 'koiki';

const extensions = [
  'js',
  'css',
  'woff',
  'woff2',
  'tff',
  'png',
  'jpg'
];

function fromCache(request) {
  return caches.open(CACHE).then(cache =>
    cache.match(request).then((matching) => {
      if (matching) {
        console.log(`[ServiceWorker] Response from cache ${request.url}`);
      }
      return matching || Promise.reject('no-match');
    })
  );
}


function updateCache(request, response) {
  return caches.open(CACHE).then(cache =>
      cache.put(request, response)
  );
}

function fromServer(request, shouldCache) {
  return fetch(request.clone()).then((response) => {
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
  const shouldCache = extensions.filter(extension =>
    evt.request.url.match(`\.${extension}$`)
  ).length !== 0;
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request, shouldCache)));
});
