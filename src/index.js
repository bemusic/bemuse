
import 'babel/polyfill'
import _           from 'lodash'
import BMS         from 'bms'

// Public: Returns a BMS.SongInfo corresponding to this BMS file.
//
// * `bmsonInfo` The `info` field of bmson
//
export function getSongInfo(bmsonInfo) {
  var info = { }
  if (bmsonInfo.title)  info.title  = bmsonInfo.title
  if (bmsonInfo.artist) info.artist = bmsonInfo.artist
  if (bmsonInfo.genre)  info.genre  = bmsonInfo.genre
  if (bmsonInfo.level)  info.level  = bmsonInfo.level
  info.subtitles = []
  return new BMS.SongInfo(info)
}

// Public: Returns the barlines as an array of beats.
//
// * `lines` The `lines` field of the bmson
//
export function getBarLines(lines) {
  return _(lines).map(({ y }) => beatForLoc(y)).sortBy().value()
}

// Public: Returns the information to be passed to BMS.Timing constructor
// in order to generate the timing data represented by the `bmson` object.
//
// * `bmson` The bmson object
//
export function getTimingInfo(bmson) {
  return {
    initialBPM: bmson.info.initBPM,
    actions:    [
      ...(bmson.bpmNotes || []).map(({ y, v }) => ({
        type: 'bpm',
        beat: beatForLoc(y),
        bpm: v,
      })),
      ...(bmson.stopNotes || []).map(({ y, v }) => ({
        type: 'stop',
        beat: beatForLoc(y),
        stopBeats: beatForLoc(Math.floor(v)),
      })),
    ],
  }
}

// Public: Returns the timing data represented by the `bmson` object.
//
// * `bmson` The bmson object
//
export function getTiming(bmson) {
  let { initialBPM, actions } = getTimingInfo(bmson)
  return new BMS.Timing(initialBPM, actions)
}

// Public: Returns the musical score (comprised of BMS.Notes and BMS.Keysounds).
//
// * `bmson` The bmson object
// * `timing` The {BMS.Timing} object that corresponds to the bmson
//
// Returns an object with these properties:
//
// * `notes` A {BMS.Notes} representing notes inside the bmson notechart.
// * `keysounds` A {BMS.Keysounds} representing mapping between keysound in the
//   `notes` field to the actual keysound file name.
//
export function getMusicalScore(bmson, timing) {
  let notes               = [ ]
  let keysounds           = { }
  let nextKeysoundNumber  = 1
  if (bmson.soundChannel) {
    for (let { name, notes: soundChannelNotes } of bmson.soundChannel) {

      let sortedNotes     = _.sortBy(soundChannelNotes, 'y')
      let keysoundNumber  = nextKeysoundNumber++
      let keysoundId      = _.padLeft('' + keysoundNumber, 4, '0')
      let slices          = getSlices(soundChannelNotes, timing)

      keysounds[keysoundId] = name

      for (let { x, y, l } of sortedNotes) {
        let note = {
          column:     getColumn(x),
          beat:       beatForLoc(y),
          keysound:   keysoundId,
          endBeat:    undefined,
        }
        if (l > 0) {
          note.endBeat = beatForLoc(y + l)
        }
        let slice = slices.get(y)
        if (slice) {
          Object.assign(note, slice)
          notes.push(note)
        }
      }
    }
  }
  return {
    notes:      new BMS.Notes(notes),
    keysounds:  new BMS.Keysounds(keysounds),
  }
}

// Public: Takes the notes for a certain `soundChannel` and returns instructions
// on how to slice the keysound file, given the `y` position of a note.
//
// * `notes` An {Array} of `notes` inside `bmson.soundChannel[i]`
// * `timing` The {BMS.Timing} object that corresponds to the bmson
//
// Returns an ES6 {Map} that maps `y` position of the note to an instruction
// object with the following properties:
//
// * `keysoundStart` The {Number} of seconds into the sound file to start playing
// * `keysoundEnd` The {Number} of seconds into the sound file to stop playing.
//   This may be `undefined` to indicate that the sound file should play until the end.
//
export function getSlices(notes, timing) {

  let all     = new Set()
  let play    = new Set()
  let restart = new Set()

  for (let { x, y, c } of notes) {
    let column = getColumn(x)
    all.add(y)
    if (column) {
      play.add(y)
    }
    if (!c) {
      restart.add(y)
    }
  }

  let result    = new Map()
  let soundTime = null
  let mustAdd   = true
  let tʹ
  let lastAdded

  for (let y of _.sortBy([...all])) {
    let t = timing.beatToSeconds(beatForLoc(y))
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

// Public: Takes the `y` coordinate value and returns the `beat`.
//
// * `y` The {Number} representing the Y position in a bmson chart.
//
// Returns a {Number} representing the beat that corresponds to that Y value.
//
export function beatForLoc(y) {
  return y / 240
}

// Public: Takes the `x` coordinate value and returns the `column`.
//
// * `x` The {Number} representing the X position in a bmson chart.
//
// Returns a {String} representing the column that this note should be put on.
//
export function getColumn(x) {
  switch (x) {
    case 1: return '1'
    case 2: return '2'
    case 3: return '3'
    case 4: return '4'
    case 5: return '5'
    case 6: return '6'
    case 7: return '7'
    case 8: return 'SC'
  }
  return undefined
}

// Public: Checks if there is a scratch in a bmson file
//
export function hasScratch(bmson) {
  if (bmson.soundChannel) {
    for (let { notes } of bmson.soundChannel) {
      for (let { x } of notes) {
        if (x === 8 || x === 18) return true
      }
    }
  }
  return false
}

// Public: Checks if there is a scratch in a bmson file
//
export function getKeys(bmson) {
  let hasKeys = false
  let hasSecondPlayer = false
  let hasDeluxeKeys = false
  if (bmson.soundChannel) {
    for (let { notes } of bmson.soundChannel) {
      for (let { x } of notes) {
        hasKeys = true
        if (x >= 11 && x <= 20) hasSecondPlayer = true
        if (x === 6 || x === 7 || x === 16 || x === 17) hasDeluxeKeys = true
      }
    }
  }
  if (!hasKeys) return 'empty'
  if (hasSecondPlayer) {
    return hasDeluxeKeys ? '14K' : '10K'
  } else {
    return hasDeluxeKeys ? '7K' : '5K'
  }
}
