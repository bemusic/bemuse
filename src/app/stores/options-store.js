
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'

import * as Actions       from '../actions/options-actions'
import { keys, get, set } from '../options'

const options川 = Bacon.update(getInitialOptions(),
  Actions.reload.bus, () => getInitialOptions(),
  Actions.setOptions.bus, (previousOptions, newOptions) => {
    for (let key of Object.keys(newOptions)) set(key, newOptions[key])
    return Object.assign({ }, previousOptions, newOptions)
  }
)

const mode川 = options川.map(options => options['player.P1.mode'])

const scratch川 = options川.map(options => {
  if (options['player.P1.mode'] === 'KB') {
    return 'off'
  } else {
    return options['player.P1.scratch']
  }
})

function getInitialOptions () {
  let options = { }
  for (let key of keys()) options[key] = get(key)
  return options
}

export default new Store({
  options:   options川,
  mode:      mode川,
  scratch:   scratch川,
})
