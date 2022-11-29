// :doc:
//
// High-accuracy timer, optionally synchronized globally.

import sync from 'timesynchro'
const Log = BemuseLogger.forModule('timesynchro')

let offset = 0

function now() {
  if (window.performance && typeof window.performance.now === 'function') {
    return window.performance.now()
  } else {
    return Date.now()
  }
}

now.synchronize = function (server: string) {
  sync(server, onFinish, onResult)
  function onResult(result: number) {
    // result + Date.now() = real time = now() + offset
    // result + Date.now() = now() + offset
    // offset = result + Date.now() - now()
    offset = result + Date.now() - now()
  }
  function onFinish(err: Error | null, result?: number) {
    if (err) {
      Log.error('Cannot synchronize time: ' + err)
    } else {
      onResult(result!)
      Log.info('Synchronized time with global server! Offset = ' + offset)
    }
  }
}

now.synchronized = function () {
  const o = offset
  return () => now() + o
}

export { now }
export default now
