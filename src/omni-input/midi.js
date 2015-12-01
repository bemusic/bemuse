
import Bacon from 'baconjs'

function observeMidiAccess (access) {
  return (
    Bacon.fromBinder(sink => {
      for (let port of access.inputs.values()) {
        sink(new Bacon.Next(port))
      }
      for (let port of access.outputs.values()) {
        sink(new Bacon.Next(port))
      }
      access.onstatechange = e => {
        sink(new Bacon.Next(e.port))
      }
    })
  )
}

function requestMIDIAccess () {
  if (!navigator.requestMIDIAccess) {
    return Promise.reject(new Error('MIDI is not supported'))
  }
  return navigator.requestMIDIAccess()
}

export function getMidi川 () {
  return (Bacon.fromPromise(requestMIDIAccess())
    .flatMap(observeMidiAccess)
    .flatMapError(e => (console.warn('MIDI Error:', e.stack), Bacon.never()))
    .flatMap(message川ForPort)
    .doLog('messageforport')
  )
}

function message川ForPort (port) {
  if (port.type !== 'input') return Bacon.never()
  return Bacon.fromEvent(port, 'midimessage')
}

export default getMidi川
