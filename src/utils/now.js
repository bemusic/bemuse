
// :doc:
//
// High-accuracy timer, optionally synchronized globally.

import sync from 'timesynchro'
const Log = BemuseLogger.forModule('timesynchro')

let now
let offset = 0

if (window.performance && typeof window.performance.now === 'function') {
  now = () => window.performance.now()
} else {
  now = () => Date.now()
}

now.synchronize = function (server) {
  sync(server, onFinish, onResult)
  function onResult (result) {
    // result + Date.now() = real time = now() + offset
    // result + Date.now() = now() + offset
    // offset = result + Date.now() - now()
    offset = result + Date.now() - now()
  }
  function onFinish (err, result) {
    if (err) {
      Log.error('Cannot synchronize time: ' + err)
    } else {
      onResult(result)
      Log.info('Synchronized time with global server! Offset = ' + offset)
    }
  }
}

now.synchronized = function () {
  let o = offset
  return () => now() + o
}

export { now }
export default now
