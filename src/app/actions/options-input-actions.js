
import { Action }     from 'bemuse/flux'
import * as Options   from '../options'

export const selectKey    = new Action()
export const deselectKey  = new Action()
export const setKeyCode   = new Action((key, keyCode) => {
  Options.set('input.P1.keyboard.' + key, keyCode)
  return { key, keyCode }
})
