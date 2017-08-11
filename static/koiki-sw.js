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
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(cache =>
    cache.match(request).then((matching) => {
      if (matching) {
        console.log(`[ServiceWorker] serving from cache ${request.url}`);
      }
      return matching || Promise.reject('no-match');
    })
  );
}


function updateCache(request, response) {
  //this is where we call the server to get the newest version of the
  //file to use the next time we show view
  return caches.open(CACHE).then(cache =>
      cache.put(request, response)
  );
}

function fromServer(request, shouldCache) {
  //this is the fallback if it is not in the cahche to go to the server and get it
  return fetch(request).then((response) => {
    if (shouldCache) {
      console.log(`[ServiceWorker] Cache requst ${request.url}`);
      updateCache(request, response);
    }
    return response;
  });
}

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] installed.');
  evt.waitUntil(
    () => {
      console.log('[ServiceWorker] Skip waiting on install');
      return self.skipWaiting();
    }
  );
});

//allow sw to control of current page
self.addEventListener('activate', () => {
  console.log('[ServiceWorker] Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log(`[ServiceWorker] Serving the asset. ${evt.request.url}`);
  const shouldCache = extensions.filter(extension =>
    evt.request.url.match(`\.${extension}$`)
  ).length !== 0;
  if (shouldCache) {
    evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request, shouldCache)));
  } else {
    evt.respondWith(fromServer(evt.request, shouldCache));
  }
});
