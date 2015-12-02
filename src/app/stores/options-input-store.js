
import _            from 'lodash'
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'
import { getName }  from 'bemuse/omni-input'

import OptionsStore from './options-store'
import * as Actions from '../actions/options-input-actions'

const order川    = OptionsStore.map(getControls)
const keyCodes川 = OptionsStore.map(getKeyboardMapping)

function getControls (state) {
  if (state.scratch === 'left') {
    return ['SC', 'SC2', '1', '2', '3', '4', '5', '6', '7']
  } else if (state.scratch === 'right') {
    return ['1', '2', '3', '4', '5', '6', '7', 'SC', 'SC2']
  } else {
    return ['1', '2', '3', '4', '5', '6', '7']
  }
}

function getKeyboardMapping (state) {
  let mapping = { }
  for (let control of ['1', '2', '3', '4', '5', '6', '7', 'SC', 'SC2']) {
    let key = 'input.P1.keyboard.' + state.mode + '.' + control
    mapping[control] = state.options[key] || ''
  }
  return mapping
}

const mode川     = OptionsStore.map(state => state.mode)
const scratch川  = OptionsStore.map(state => state.scratch)
const texts川    = keyCodes川.map((keyCodes) => _.mapValues(keyCodes, getName))
const editing川  = Bacon.update(null,
  [Actions.selectKey.bus],    (prev, key) => key,
  [Actions.deselectKey.bus],  () => null,
  [Actions.selectNextKey.bus, order川], (prev, key, order) => {
    let index = order.indexOf(key)
    if (index + 1 >= order.length) {
      return null
    } else {
      return order[index + 1]
    }
  }
)

export default new Store({
  mode:       mode川,
  texts:      texts川,
  editing:    editing川,
  scratch:    scratch川,
  keyCodes:   keyCodes川,
})
