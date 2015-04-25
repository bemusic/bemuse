
import Bacon      from 'baconjs'
import { Action } from 'bemuse/flux'
import $          from 'jquery'

export const startLoading   = new Action()
export const finishLoading  = new Action()
export const errorLoading   = new Action()

let loadCollectionBus = new Bacon.Bus()
export function loadCollection(url) {
  loadCollectionBus.push({ url })
}

loadCollectionBus
.flatMapLatest(server => {
  let bus = new Bacon.Bus()
  setTimeout(function() {
    bus.push(() => startLoading(server))
    Promise.resolve($.get(server.url + '/index.json'))
    .then(function(collection) {
      bus.push(() => finishLoading(collection))
    })
    .catch(function(e) {
      bus.push(() => errorLoading(e))
    })
  })
  return bus
})
.onValue(f => f())
