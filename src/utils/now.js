
// :doc:
//
// High-accuracy timer, optionally synchronized globally.

import sync from 'timesynchro'

let now
let offset = 0

if (window.performance && typeof window.performance.now === 'function') {
  now = () => window.performance.now()
} else {
  now = () => Date.now()
}

now.synchronize = function(server) {
  sync(server, onFinish, onResult)
  function onResult(result) {
    // result + Date.now() = real time = now() + offset
    // result + Date.now() = now() + offset
    // offset = result + Date.now() - now()
    offset = result + Date.now() - now()
  }
  function onFinish(err, result) {
    if (err) {
      console.error('Cannot synchronize time!', err)
    } else {
      onResult(result)
      console.log('Synchronized. Offset = ' + offset)
    }
  }
}

now.synchronized = function() {
  let o = offset
  return () => now() + o
}

export { now }
export default now
