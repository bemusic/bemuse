
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'
import * as Actions from '../actions/custom-bms-actions'

import DndResources from 'bemuse/resources/dnd-resources'
import { loadSongFromResources } from '../song-loader'

const operation川 = Actions.drop.bus.map(handleDrop)
const clears川 = Actions.clear.bus.map(() => ({ log: Bacon.constant(null) }))
const log川 = (operation川.merge(clears川)
  .flatMapLatest(op => op.log)
  .toProperty(null)
)

function handleDrop ({ event, callback }) {
  let resources = new DndResources(event)
  let message川 = new Bacon.Bus()
  let currentLog川 = message川.scan([], (array, message) => array.concat([message]))

  loadSongFromResources(resources, {
    onMessage (message) {
      message川.push(message)
    },
  })
  .tap(song => {
    song.id = '__custom_' + Date.now()
    song.custom = true
    if (callback) callback(song)
  })
  .done()

  return {
    log: currentLog川,
  }
}

export default new Store({
  log: log川,
})
