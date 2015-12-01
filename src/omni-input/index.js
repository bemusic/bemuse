import keycode from 'keycode'
import _ from 'lodash'
import Bacon from 'baconjs'


// Public: OmniInput is a poll-based class that handles the key-pressed state of
// multiple inputs.
//
// Each call to `update()` returns a mapping of active inputs. This object may
// be reused and mutated by OmniInput for performance reasons, and thus the
// caller SHOULD NOT hold on to or mutate it.
//
// ## Keys
//
// The key is a string that identifies some key on each input.
// It follows the following convention:
//
// - `65` A keyboard keycode.
// - `gamepad.0.button.3` A gamepad button.
// - `gamepad.0.axis.3.positive` A gamepad axis (positive value).
// - `gamepad.0.axis.3.negative` A gamepad axis (negative value).
// - `midi.ID.note.60` A MIDI note.
//
export class OmniInput {
  constructor (win = window) {
    this._window = win
    this._disposables = [
      listen(win, 'keydown', e => this._handleKeyDown(e)),
      listen(win, 'keyup',   e => this._handleKeyUp(e)),
    ]
    this._status = { }
  }
  _handleKeyDown (e) {
    this._status[`${e.which}`] = true
  }
  _handleKeyUp (e) {
    this._status[`${e.which}`] = false
  }
  _updateGamepads () {
    const nav = this._window.navigator
    const gamepads = (nav.getGamepads
      ? nav.getGamepads()
      : (nav.webkitGetGamepads ? nav.webkitGetGamepads() : [])
    )
    if (!gamepads) return
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i]
      if (gamepad) {
        this._updateGamepad(gamepad)
      }
    }
  }
  _updateGamepad (gamepad) {
    const prefix = `gamepad.${gamepad.index}`
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i]
      this._status[`${prefix}.button.${i}`] = button && button.value >= 0.5
    }
    for (let i = 0; i < gamepad.axes.length; i++) {
      const axis = gamepad.axes[i]
      this._status[`${prefix}.axis.${i}.positive`] = axis >= 0.01
      this._status[`${prefix}.axis.${i}.negative`] = axis <= -0.01
    }
  }
  update () {
    this._updateGamepads()
    return this._status
  }
  dispose () {
    for (let disposable of this._disposables) {
      disposable.dispose()
    }
  }
}


// Public: Returns a Bacon EventStream of keys pressed.
//
export function key川 (input = new OmniInput(), win = window) {
  return _key川ForUpdate川(
    Bacon.fromBinder(sink => {
      const handle = win.setInterval(() => {
        sink(new Bacon.Next(input.update()))
      }, 16)
      return () => win.clearInterval(handle)
    })
  )
}


export function _key川ForUpdate川 (update川) {
  return (update川
    .map(update => Object.keys(update).filter(key => update[key]))
    .diff([ ], (previous, current) => _.difference(current, previous))
    .flatMap(array => Bacon.fromArray(array))
  )
}


export default OmniInput


export function getName (key) {
  if (+key) {
    return textFromKeyCode(+key)
  }
  {
    const match = key.match(/^gamepad\.(\d+)\.axis\.(\d+)\.(\w+)/)
    if (match) {
      return `Joy${match[1]} Axis${match[2]} (${match[3] === 'positive' ? '+' : '-'})`
    }
  }
  {
    const match = key.match(/^gamepad\.(\d+)\.button\.(\d+)/)
    if (match) {
      return `Joy${match[1]} Btn${match[2]}`
    }
  }
  return `${key}?`
}


function textFromKeyCode (keyCode) {
  return _.capitalize(keycode(keyCode))
}


function listen (subject, eventName, listener) {
  subject.addEventListener(eventName, listener)
  return {
    dispose () {
      subject.removeEventListener(eventName, listener)
    }
  }
}
