
import 'babel/polyfill'
import _           from 'lodash'
import BMS         from 'bms'
import * as legacy from './legacy'
import * as utils  from './utils'

// Public: Returns a BMS.SongInfo corresponding to this BMS file.
//
// * `bmson` The bmson object
//
export function songInfoForBmson (bmson) {
  const bmsonInfo = bmson.info
  let info = { }
  if (bmsonInfo.title)  info.title  = bmsonInfo.title
  if (bmsonInfo.artist) info.artist = bmsonInfo.artist
  if (bmsonInfo.genre)  info.genre  = bmsonInfo.genre
  if (bmsonInfo.level)  info.level  = bmsonInfo.level
  info.subtitles = getSubtitles()
  if (bmsonInfo.subartists) info.subartists = bmsonInfo.subartists
  return new BMS.SongInfo(info)

  function getSubtitles () {
    let subtitles = [ ]
    if (typeof bmsonInfo.chart_name === 'string') {
      subtitles.push(bmsonInfo.chart_name)
    }
    if (typeof bmsonInfo.subtitle === 'string') {
      subtitles.push(...bmsonInfo.subtitle.split('\n'))
    }
    return subtitles
  }
}

// Public: Returns the barlines as an array of beats.
//
// * `bmson` The bmson object
//
export function barLinesForBmson (bmson) {
  if (!bmson.version) return legacy.barLinesForBmson(bmson)
  let beatForPulse = beatForPulseForBmson(bmson)
  let lines = bmson.lines
  return _(lines).map(({ y }) => beatForPulse(y)).sortBy().value()
}

// Public: Returns the information to be passed to BMS.Timing constructor
// in order to generate the timing data represented by the `bmson` object.
//
// * `bmson` The bmson object
//
export function timingInfoForBmson (bmson) {
  if (!bmson.version) return legacy.timingInfoForBmson(bmson)
  let beatForPulse = beatForPulseForBmson(bmson)
  return {
    initialBPM: bmson.info.init_bpm,
    actions:    [
      ...(bmson.bpm_events || []).map(({ y, bpm }) => ({
        type: 'bpm',
        beat: beatForPulse(y),
        bpm: bpm,
      })),
      ...(bmson.stop_events || []).map(({ y, duration }) => ({
        type: 'stop',
        beat: beatForPulse(y),
        stopBeats: beatForPulse(Math.floor(duration)),
      })),
    ],
  }
}

// Public: Returns the timing data represented by the `bmson` object.
//
// * `bmson` The bmson object
//
function timingForBmson (bmson) {
  let { initialBPM, actions } = timingInfoForBmson(bmson)
  return new BMS.Timing(initialBPM, actions)
}

// Public: Returns the musical score (comprised of BMS.Notes and BMS.Keysounds).
//
// * `bmson` The bmson object
//
// Returns an object with these properties:
//
// * `notes` A {BMS.Notes} representing notes inside the bmson notechart.
// * `keysounds` A {BMS.Keysounds} representing mapping between keysound in the
//   `notes` field to the actual keysound file name.
// * `timing` The {BMS.Timing} object for this musical score.
//
export function musicalScoreForBmson (bmson) {
  let timing    = timingForBmson(bmson)
  let { notes, keysounds } = (
    notesDataAndKeysoundsDataForBmsonAndTiming(bmson, timing)
  )
  return {
    timing,
    notes:      new BMS.Notes(notes),
    keysounds:  new BMS.Keysounds(keysounds),
  }
}

function soundChannelsForBmson (bmson) {
  return bmson.version ? bmson.sound_channels : bmson.soundChannel
}

function notesDataAndKeysoundsDataForBmsonAndTiming (bmson, timing) {
  let nextKeysoundNumber  = 1
  let beatForPulse        = beatForPulseForBmson(bmson)
  let notes               = [ ]
  let keysounds           = { }
  let soundChannels       = soundChannelsForBmson(bmson)
  if (soundChannels) {
    for (let { name, notes: soundChannelNotes } of soundChannels) {

      let sortedNotes     = _.sortBy(soundChannelNotes, 'y')
      let keysoundNumber  = nextKeysoundNumber++
      let keysoundId      = _.padLeft('' + keysoundNumber, 4, '0')
      let slices          = utils.slicesForNotesAndTiming(soundChannelNotes, timing, {
        beatForPulse: beatForPulse,
      })

      keysounds[keysoundId] = name

      for (let { x, y, l } of sortedNotes) {
        let note = {
          column:     getColumn(x),
          beat:       beatForPulse(y),
          keysound:   keysoundId,
          endBeat:    undefined,
        }
        if (l > 0) {
          note.endBeat = beatForPulse(y + l)
        }
        let slice = slices.get(y)
        if (slice) {
          Object.assign(note, slice)
          notes.push(note)
        }
      }
    }
  }
  return { notes, keysounds }
}

export { _slicesForNotesAndTiming } from './legacy'

function beatForPulseForBmson (bmson) {
  if (!bmson.version) return legacy.beatForLoc
  const resolution = (bmson.info && bmson.info.resolution) || 240
  return y => y / resolution
}

// Private: Takes the `x` coordinate value and returns the `column`.
//
// * `x` The {Number} representing the X position in a bmson chart.
//
// Returns a {String} representing the column that this note should be put on.
//
function getColumn (x) {
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
export function hasScratch (bmson) {
  const soundChannels = soundChannelsForBmson(bmson)
  if (soundChannels) {
    for (let { notes } of soundChannels) {
      for (let { x } of notes) {
        if (x === 8 || x === 18) return true
      }
    }
  }
  return false
}

// Public: Checks if there is a scratch in a bmson file
//
export function keysForBmson (bmson) {
  const soundChannels = soundChannelsForBmson(bmson)
  let hasKeys = false
  let hasSecondPlayer = false
  let hasDeluxeKeys = false
  if (soundChannels) {
    for (let { notes } of soundChannels) {
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
