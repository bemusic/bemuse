
import { createIO } from 'impure'
import * as options from '../options'
import * as ReduxState from '../redux/ReduxState'

export function loadInitialOptions () {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
      options: options.getAllCurrentOptions()
    })

    // HACK: Dispatch when options change!
    options.events.on('changed', () => {
      store.dispatch({
        type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
        options: options.getAllCurrentOptions()
      })
    })
  })
}

export function setOptions (changes) {
  return createIO(() => {
    options.setOptions(changes)
  })
}

export function setKeyCode (mode, key, keyCode) {
  return setOptions({ ['input.P1.keyboard.' + mode + '.' + key]: keyCode })
}

export function setMode (mode) {
  return setOptions({ 'player.P1.mode': mode })
}

export function setSpeed (speed) {
  return setOptions({ 'player.P1.speed': speed })
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
