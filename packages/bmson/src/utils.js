
import _ from 'lodash'

// Private: Takes the notes for a certain `soundChannel` and returns instructions
// on how to slice the keysound file, given the `y` position of a note.
//
// * `notes` An {Array} of `notes` inside `bmson.soundChannel[i]`
// * `timing` The {BMS.Timing} object that corresponds to the bmson
// * `options` An {Object} of options with the following keys:
//    * `beatForPulse` A {Function} used to resolve beat for a given pulse number
//
// Returns an ES6 {Map} that maps `y` position of the note to an instruction
// object with the following properties:
//
// * `keysoundStart` The {Number} of seconds into the sound file to start playing
// * `keysoundEnd` The {Number} of seconds into the sound file to stop playing.
//   This may be `undefined` to indicate that the sound file should play until the end.
//
export function slicesForNotesAndTiming (notes, timing, options) {
  const { beatForPulse } = options

  let all = new Set()
  let play = new Set()
  let restart = new Set()

  for (let { x, y, c } of notes) {
    all.add(y)
    if (x) {
      play.add(y)
    }
    if (!c) {
      restart.add(y)
    }
  }

  let result = new Map()
  let soundTime = null
  let mustAdd = true
  let tʹ
  let lastAdded

  for (let y of _.sortBy([...all])) {
    let t = timing.beatToSeconds(beatForPulse(y))
    if (soundTime === null || restart.has(y)) {
      soundTime = 0
    } else {
      soundTime += t - tʹ
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
