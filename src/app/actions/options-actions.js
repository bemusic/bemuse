
import { Action } from 'bemuse/flux'
import * as options from '../options'

export const setOptions = new Action()
export const reload     = new Action()

// HACK: Keep it here until it is cleaned...
setOptions.bus.onValue((changes) => {
  options.setOptions(changes)
})

export function setMode (mode) {
  return setOptions({ 'player.P1.mode': mode })
}

export function setScratch (position) {
  if (position === 'off') {
    return setMode('KB')
  } else {
    return setOptions({
      'player.P1.mode': 'BM',
      'player.P1.scratch': position,
    })
  }
}
