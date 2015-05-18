
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'
import * as Actions from '../actions/custom-bms-actions'

import DndResources from 'bemuse/resources/dnd-resources'
import { loadSongFromResources } from '../song-loader'

const $operation = Actions.drop.bus.map(handleDrop)
const $log       = $operation.flatMapLatest(op => op.log).toProperty(null)

function handleDrop({ event, callback }) {
  let resources = new DndResources(event)
  let $message  = new Bacon.Bus()
  let $$log     = $message.scan([], (array, message) => array.concat([message]))
  loadSongFromResources(resources, {
    onMessage(message) {
      $message.push(message)
    },
  })
  .tap(song => {
    if (callback) callback(song)
  })
  .done()
  return {
    log: $$log,
  }
}

export default new Store({
  log: $log,
})
