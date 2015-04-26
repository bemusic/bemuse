
import _            from 'lodash'
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'
import keycode      from 'keycode'
import * as Options from '../options'
import * as Actions from '../actions/options-input-actions'

const $order    = Bacon.constant(['SC', '1', '2', '3', '4', '5', '6', '7'])
const $keyCodes = Bacon.update(Options.getKeyboardMapping(),
    [Actions.setKeyCode.bus], (prev, { key, keyCode }) => {
      return Object.assign({ }, prev, { [key]: keyCode })
    })

const $texts    = $keyCodes.map((keyCodes) => _.mapValues(keyCodes, toText))
const $editing  = Bacon.update(null,
    [Actions.selectKey.bus],    (prev, key) => key,
    [Actions.deselectKey.bus],  () => null,
    [Actions.setKeyCode.bus, $order], (prev, { key, keyCode }, order) => {
      let index = order.indexOf(key)
      if (index + 1 >= order.length) {
        return null
      } else {
        return order[index + 1]
      }
    })

export default new Store({
  texts:    $texts,
  editing:  $editing,
})

function toText(keyCode) {
  return _.capitalize(keycode(keyCode))
}
