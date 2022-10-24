/* global caches */

import version from 'bemuse/utils/version'

function log(...args) {
  console.log(
    '%c serviceworker %c',
    'background:yellow;color:black',
    '',
    ...args
  )
}

log('I am a service worker! ' + version)

const APP_CACHE_KEY = 'app'
const SITE_CACHE_KEY = 'site-v' + version
const RES_CACHE_KEY = 'site-v' + version
const SKIN_CACHE_KEY = 'skin-v' + version
const SONG_CACHE_KEY = 'songs'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(SITE_CACHE_KEY)
      .then((cache) => cache.addAll(['/']))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', function () {
  log('Service worker activated! Claiming clients now!')
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  const request = event.request
  if (request.headers.get('range')) {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=575357
    log('Bailing out for ranged request.', event.request.url)
    return
  }
  const project = location.origin + '/project'
  if (request.url.startsWith(project) || request.url === project) {
    log('Bailing out for project website.')
    return
  }
  const build = location.origin + '/build/'
  const skin = location.origin + '/skins/'
  const res = location.origin + '/res/'
  const site = location.origin
  if (request.url.startsWith(build)) {
    if (request.url !== build + 'boot.js') {
      return cacheForever(event, APP_CACHE_KEY)
    }
  }
  if (request.url.match(/assets\/[^/]+\.bemuse$/)) {
    return cacheForever(event, SONG_CACHE_KEY)
  }
  if (request.url.match(/\.(bms|bme|bml)$/)) {
    return fetchThenCache(event, SONG_CACHE_KEY)
  }
  if (request.url.match(/\/index\.json$/)) {
    return fetchThenCache(event, SONG_CACHE_KEY)
  }
  if (request.url.match(/\/assets\/metadata\.json$/)) {
    return fetchThenCache(event, SONG_CACHE_KEY)
  }
  if (request.url.startsWith(skin)) {
    return staleWhileRevalidate(event, SKIN_CACHE_KEY)
  }
  if (request.url.startsWith(res)) {
    return staleWhileRevalidate(event, RES_CACHE_KEY)
  }
  if (request.url.startsWith(site)) {
    return fetchThenCache(event, SITE_CACHE_KEY)
  }
  if (request.url.startsWith('https://fonts.googleapis.com/')) {
    return staleWhileRevalidate(event, SKIN_CACHE_KEY)
  }
})

function cacheForever(event, cacheName) {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(event.request).then(function (cached) {
        return (
          cached ||
          fetch(event.request).then(function (response) {
            log('Cache forever:', event.request.url)
            cache.put(event.request, response.clone())
            return response
          })
        )
      })
    })
  )
}

function fetchThenCache(event, cacheName) {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return fetch(event.request)
        .then(function (response) {
          if (response && response.ok) {
            log('Fetch OK:', event.request.url)
            cache.put(event.request, response.clone())
            return response
          } else {
            return cache.match(event.request)
          }
        })
        .catch(function () {
          return cache.match(event.request)
        })
    })
  )
}

function staleWhileRevalidate(event, cacheName) {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(event.request).then(function (cached) {
        const promise = fetch(event.request).then(function (response) {
          if (response && response.ok) {
            log('Updated:', event.request.url)
            cache.put(event.request, response.clone())
          }
          return response
        })
        return cached || promise
      })
    })
  )
}
