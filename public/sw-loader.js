
// Script to load the service worker.

void (function () {
  var match = location.search.match(/^\?path=([^&]+)/)
  if (!match) return
  var path = decodeURIComponent(match[1])
  if (!path.match(/^build\/\w+\.serviceworker\.js$/)) return
  console.log('I shall import', path)
  importScripts(path)
})()
