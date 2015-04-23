
import Bacon      from 'baconjs'
import { Action } from 'bemuse/flux'
import $          from 'jquery'

export const startLoading   = new Action()
export const finishLoading  = new Action()
export const errorLoading   = new Action()

export const loadCollection = new Action(url => ({ url }))

loadCollection
.bus
.flatMapLatest(server => {
  let promise = Promise.resolve($.get(server.url + '/index.json'))
  .then(function(collection) {
    return () => finishLoading(collection)
  })
  .catch(function(e) {
    return () => errorLoading(e)
  })
  return Bacon.once(() => startLoading(server))
      .merge(Bacon.fromPromise(promise))
})
.onValue(f => f())
