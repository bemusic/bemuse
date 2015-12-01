import keycode from 'keycode'
import _ from 'lodash'
import Bacon from 'baconjs'
import getMidi川 from './midi'


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
// - `midi.[id].[channel].note.[note]` A MIDI note.
// - `midi.[id].[channel].sustain` Sustain pedal.
// - `midi.[id].[channel].mod` Modulation level.
// - `midi.[id].[channel].pitch.up` Pitch bend (up).
// - `midi.[id].[channel].pitch.down` Pitch bend (down).
//
export class OmniInput {
  constructor (win = window, options = { }) {
    const midi川 = (options.getMidi川 || getMidi川)()
    this._window = win
    this._disposables = [
      listen(win, 'keydown', e => this._handleKeyDown(e)),
      listen(win, 'keyup',   e => this._handleKeyUp(e)),
      midi川.onValue(e => this._handleMIDIMessage(e)),
    ]
    this._status = { }
  }
  _handleKeyDown (e) {
    this._status[`${e.which}`] = true
  }
  _handleKeyUp (e) {
    this._status[`${e.which}`] = false
  }
  _handleMIDIMessage (e) {
    if (!e || !e.data) return
    const data = e.data
    const prefix = `midi.${e.target.id}.${e.data[0] & 0x0F}`
    const handleNote = (state) => {
      this._status[`${prefix}.note.${data[1]}`] = state
    }
    if ((data[0] & 0xF0) === 0x80) { // NoteOff
      handleNote(false)
    } else if ((data[0] & 0xF0) === 0x90) { // NoteOn
      if (data[2] > 0x0) { // NoteOn (really)
        handleNote(true)
      } else { // NoteOff disguised as NoteOn
        handleNote(false)
      }
    } else if ((data[0] & 0xF0) === 0xB0) { // CC
      if (data[1] === 0x40) { // Sustain
        this._status[`${prefix}.sustain`] = data[2] >= 64
      } else if (data[1] === 0x01) { // Modulation
        this._status[`${prefix}.mod`] = data[2] >= 16
      }
    } else if ((data[0] & 0xF0) === 0xE0) { // Pitch Bend
      const bend = data[1] | (data[2] << 7)
      this._status[`${prefix}.pitch.up`] = bend >= 0x2100
      this._status[`${prefix}.pitch.down`] = bend < 0x1F00
    }
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
    for (let dispose of this._disposables) {
      dispose()
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


const knownMidiIds = { }

export function getName (key) {
  if (+key) {
    return _.capitalize(keycode(+key))
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
  {
    const match = key.match(/^midi\.(.+)\.(\d+)\.(.+)$/)
    if (match) {
      const rest = match[3].split('.')
      const id = match[1]
      const midiDeviceNumber = (
        knownMidiIds[id] || (knownMidiIds[id] = Object.keys(knownMidiIds).length + 1)
      )
      const prefix = `MIDI${midiDeviceNumber} Ch${+match[2] + 1}`
      if (rest[0] === 'note') {
        const midiNote = +rest[1]
        const lookup = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const noteName = lookup[midiNote % 12]
        const octave = Math.floor(midiNote / 12) - 1
        return `${prefix} ${noteName}${octave}`
      }
      if (rest[0] === 'pitch') {
        return `${prefix} Pitch${rest[1] === 'up' ? '+' : '-'}`
      }
      if (rest[0] === 'sustain') return 'Sustain'
      if (rest[0] === 'mod') return 'Mod'
    }
  }
  return `${String(key).replace(/\./g, ' ')}?`
}


function listen (subject, eventName, listener) {
  subject.addEventListener(eventName, listener)
  return function dispose () {
    subject.removeEventListener(eventName, listener)
  }
}
