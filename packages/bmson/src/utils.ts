import _ from 'lodash'
import * as BMS from 'bms'
import { Note } from './types'

export interface SoundSlice {
  /**
   * The number of seconds into the sound file to start playing
   */
  keysoundStart: number
  /**
   * The {Number} of seconds into the sound file to stop playing.
   * This may be `undefined` to indicate that the sound file should play until the end.
   */
  keysoundEnd?: number
}

export interface TimingInfo {
  initialBPM: number
  actions: BMS.TimingAction[]
}

/**
 * Takes the notes for a certain `soundChannel` and returns instructions
 * on how to slice the keysound file, given the `y` position of a note.
 *
 * @param notes An {Array} of `notes` inside `bmson.soundChannel[i]`
 * @param timing The {BMS.Timing} object that corresponds to the bmson
 * @param options An {Object} of options with the following keys:
 *  * `beatForPulse` A {Function} used to resolve beat for a given pulse number
 * @returns an ES6 {Map} that maps `y` position of the note to an SoundSlice
 */
export function slicesForNotesAndTiming(
  notes: Note[],
  timing: BMS.Timing,
  options: { beatForPulse: (pulse: number) => number }
) {
  const { beatForPulse } = options

  let all = new Set<number>()
  let play = new Set<number>()
  let restart = new Set<number>()

  for (let { x, y, c } of notes) {
    all.add(y)
    if (x) {
      play.add(y)
    }
    if (!c) {
      restart.add(y)
    }
  }

  let result = new Map<number, SoundSlice>()
  let soundTime = null
  let mustAdd = true
  let tʹ: number
  let lastAdded: SoundSlice | undefined

  for (let y of _.sortBy([...all])) {
    let t = timing.beatToSeconds(beatForPulse(y))
    if (soundTime === null || restart.has(y)) {
      soundTime = 0
    } else {
      soundTime += t - tʹ!
    }
    let shouldAdd = mustAdd || play.has(y) || restart.has(y)
    if (shouldAdd) {
      if (lastAdded && !restart.has(y)) {
        lastAdded.keysoundEnd = soundTime
      }
      let obj = { keysoundStart: soundTime, keysoundEnd: undefined }
      result.set(y, obj)
      lastAdded = obj
    }
    mustAdd = play.has(y)
    tʹ = t
  }

  return result
}
