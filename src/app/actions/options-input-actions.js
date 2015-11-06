
import { Action }     from 'bemuse/flux'
import { setOptions } from './options-actions'

export const selectKey      = new Action()
export const deselectKey    = new Action()
export const selectNextKey  = new Action()

export function setKeyCode (mode, key, keyCode) {
  setOptions({ ['input.P1.keyboard.' + mode + '.' + key]: keyCode })
  selectNextKey(key)
}
