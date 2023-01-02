import {
  Observable,
  Subscription,
  concat,
  concatMap,
  fromEvent,
  map,
  of,
  pairwise,
} from 'rxjs'

import { AxisLogic } from './axis-logic'
import _ from 'lodash'
import getMidi川 from './midi'
import keycode from 'keycode'

declare global {
  interface Navigator {
    webkitGetGamepads?(): (Gamepad | null)[]
  }
}

export interface OmniInputOptions {
  getMidi川?: () => Observable<MIDIMessageEvent>
  exclusive?: boolean
  continuous?: boolean
  sensitivity?: number
}

export type KeyState = Record<string, boolean>

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
  constructor(
    private readonly win: Window = window,
    options: OmniInputOptions = {}
  ) {
    const midi川 = (options.getMidi川 || getMidi川)()
    this.exclusive = !!options.exclusive
    this.continuousAxis = !!options.continuous
    this.setGamepadSensitivity(options.sensitivity ?? 3)

    this.subscriptions = [
      fromEvent<KeyboardEvent>(win, 'keydown').subscribe(this.handleKeyDown),
      fromEvent<KeyboardEvent>(win, 'keyup').subscribe(this.handleKeyUp),
      midi川.subscribe(this.handleMIDIMessage),
    ]
  }

  private readonly exclusive: boolean
  private continuousAxis: boolean
  private sensitivity: number = 0
  analogThreshold: number = 0
  private deadzone: number = 0
  private status: KeyState = {}
  private axis: Record<string, AxisLogic> = {}

  private readonly subscriptions: readonly Subscription[]

  private handleKeyDown = (e: KeyboardEvent) => {
    this.status[`${e.which}`] = true
    if (this.exclusive) e.preventDefault()
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.status[`${e.which}`] = false
  }

  private handleMIDIMessage = (e: MIDIMessageEvent) => {
    if (!e || !e.data) return
    const data = e.data
    const prefix = `midi.${e.target?.id}.${e.data[0] & 0x0f}`
    const handleNote = (state: boolean) => {
      this.status[`${prefix}.note.${data[1]}`] = state
    }
    if ((data[0] & 0xf0) === 0x80) {
      // NoteOff
      handleNote(false)
    } else if ((data[0] & 0xf0) === 0x90) {
      // NoteOn
      if (data[2] > 0x0) {
        // NoteOn (really)
        handleNote(true)
      } else {
        // NoteOff disguised as NoteOn
        handleNote(false)
      }
    } else if ((data[0] & 0xf0) === 0xb0) {
      // CC
      if (data[1] === 0x40) {
        // Sustain
        this.status[`${prefix}.sustain`] = data[2] >= 64
      } else if (data[1] === 0x01) {
        // Modulation
        this.status[`${prefix}.mod`] = data[2] >= 16
      }
    } else if ((data[0] & 0xf0) === 0xe0) {
      // Pitch Bend
      const bend = data[1] | (data[2] << 7)
      this.status[`${prefix}.pitch.up`] = bend >= 0x2100
      this.status[`${prefix}.pitch.down`] = bend < 0x1f00
    }
  }

  private updateGamepads() {
    const nav = this.win.navigator
    const gamepads = this.fetchGamepads(nav)
    if (!gamepads) return
    for (const gamepad of gamepads) {
      if (gamepad) {
        this.updateGamepad(gamepad)
      }
    }
  }

  private fetchGamepads(nav: Navigator) {
    if (nav.getGamepads) {
      return nav.getGamepads()
    }
    if (nav.webkitGetGamepads) {
      return nav.webkitGetGamepads()
    }
    return []
  }

  private updateGamepad(gamepad: Gamepad) {
    const prefix = `gamepad.${gamepad.index}`
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i]
      this.status[`${prefix}.button.${i}`] = button && button.value >= 0.5
    }
    for (let i = 0; i < gamepad.axes.length; i++) {
      const axisName = `${prefix}.axis.${i}`
      let axis = gamepad.axes[i]

      if (this.continuousAxis) {
        if (this.axis[axisName] == null) {
          this.axis[axisName] = new AxisLogic()
        }
        axis = this.axis[axisName].update(axis)
      }

      this.status[`${axisName}.positive`] = axis >= this.deadzone
      this.status[`${axisName}.negative`] = axis <= -this.deadzone
    }
  }

  update(): KeyState {
    this.updateGamepads()
    return this.status
  }

  setGamepadSensitivity(sensitivity: number) {
    this.sensitivity = sensitivity
    this.deadzone = (9 - this.sensitivity) * 0.05
    if (this.deadzone < 0.01) this.deadzone = 0.01
    this.analogThreshold = 18 - this.sensitivity * 2
  }

  setGamepadContinuousAxisEnabled(enabled: boolean) {
    this.continuousAxis = enabled
  }

  dispose() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
}

// Public: Returns a Bacon EventStream of keys pressed.
//
export function key川(
  input = new OmniInput(),
  win: Window = window
): Observable<string> {
  return _key川ForUpdate川(
    new Observable<KeyState>((subscriber) => {
      const handle = win.setInterval(() => {
        subscriber.next(input.update())
      }, 16)
      return () => win.clearInterval(handle)
    })
  )
}

export function _key川ForUpdate川(
  update川: Observable<KeyState>
): Observable<string> {
  return concat(
    of<string[]>([]),
    update川.pipe(
      map((update) => Object.keys(update).filter((key) => update[key]))
    )
  )
    .pipe(pairwise())
    .pipe(map(([previous, current]) => _.difference(current, previous)))
    .pipe(concatMap((array) => of(...array)))
}

export default OmniInput

const knownMidiIds = new Map<string, number>()

export function getName(key: string) {
  if (+key) {
    return _.capitalize(keycode(+key))
  }
  {
    const match = key.match(/^gamepad\.(\d+)\.axis\.(\d+)\.(\w+)/)
    if (match) {
      return `Joy${match[1]} Axis${match[2]} (${
        match[3] === 'positive' ? '+' : '-'
      })`
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
      if (!knownMidiIds.has(id)) {
        knownMidiIds.set(id, knownMidiIds.size + 1)
      }
      const midiDeviceNumber = knownMidiIds.get(id)!
      const prefix = `MIDI${midiDeviceNumber} Ch${+match[2] + 1}`
      if (rest[0] === 'note') {
        const midiNote = +rest[1]
        const lookup = [
          'C',
          'C#',
          'D',
          'D#',
          'E',
          'F',
          'F#',
          'G',
          'G#',
          'A',
          'A#',
          'B',
        ]
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
