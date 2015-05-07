
import { Action } from 'bemuse/flux'

export const setOptions = new Action()
export const reload     = new Action()

export function setMode(mode) {
  return setOptions({ 'player.P1.mode': mode })
}

export function setScratch(position) {
  if (position === 'off') {
    return setMode('KB')
  } else {
    return setOptions({
      'player.P1.mode': 'BM',
      'player.P1.scratch': position,
    })
  }
}
