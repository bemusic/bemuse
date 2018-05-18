import _ from 'lodash'
import * as BMS from 'bms'
import * as legacy from './legacy'
import * as utils from './utils'

/**
 * @typedef {Object} Bmson
 * @property {string} version bmson version
 * @property {BmsonInfo} info information, e.g. title, artist, …
 * @property {BarLine[]?} lines location of bar-lines in pulses
 * @property {BpmEvent[]?} bpm_events bpm changes
 * @property {StopEvent[]?} stop_events stop events
 * @property {SoundChannel[]} sound_channels note data
 * @property {BGA} bga bga data
 */

/**
 * @typedef {Object} BmsonInfo
 * @property {string} title
 * @property {string} [subtitle=""]
 * @property {string} artist
 * @property {string[]} [subartists=[]] ["key:value"]
 * @property {string} genre
 * @property {string} [mode_hint="beat-7k"] layout hints, e.g. "beat-7k", "popn-5k", "generic-nkeys"
 * @property {string} chart_name // e.g. "HYPER", "FOUR DIMENSIONS"
 * @property {number} level
 * @property {double} init_bpm
 * @property {double} [judge_rank=100] relative judge width
 * @property {double} [total=100] relative life bar gain
 * @property {string} [back_image] background image filename
 * @property {string} [eyecatch_image] eyecatch image filename
 * @property {string} [banner_image] banner image filename
 * @property {string} [preview_music] preview music filename
 * @property {number} [resolution=240] pulses per quarter note
 */

/**
 * [A bmson Bar Line](http://bmson-spec.readthedocs.io/en/master/doc/index.html#time-signatures),
 * used for time signature
 * @typedef {Object} BarLine
 * @property {number} y the pulse number
 */

/**
 * [bmson Sound Channel](http://bmson-spec.readthedocs.io/en/master/doc/index.html#sound-channels)
 * @typedef {Object} SoundChannel
 * @property {string} name sound file name
 * @property {Note[]} notes notes using this sound
 */
/**
 * @typedef {Object} Note
 * @property {any} x lane
 * @property {number} y pulse number
 * @property {number} l length (0: normal note; greater than zero (length in pulses): long note)
 * @property {number} c continuation flag
 */

/**
 * @typedef {Object} BpmEvent
 * @property {number} y pulse number
 * @property {number} bpm
 */
/**
 * @typedef {Object} StopEvent
 * @property {number} y pulse number
 * @property {number} duration number of pulses to stop
 */
/**
 * [bmson BGA](http://bmson-spec.readthedocs.io/en/master/doc/index.html#bga-bga)
 * @typedef {Object} BGA
 * @property {BGAHeader[]} bga_header picture id and filename
 * @property {BGAEvent[]} bga_events picture sequence
 * @property {BGAEvent[]} layer_events picture sequence overlays bga_events
 * @property {BGAEvent[]} poor_events picture sequence when missed
 */
/**
 * @typedef {Object} BGAHeader
 * @property {number} id
 * @property {string} name picture file name
 */
/**
 * @typedef {Object} BGAEvent
 * @property {number} y
 * @property {number} id corresponds to {BGAHeader}.id
 */

/**
 * Returns a BMS.SongInfo corresponding to this BMS file.
 * @param {Bmson} bmson
 */
export function songInfoForBmson (bmson) {
  const bmsonInfo = bmson.info
  let info = {}
  if (bmsonInfo.title) info.title = bmsonInfo.title
  if (bmsonInfo.artist) info.artist = bmsonInfo.artist
  if (bmsonInfo.genre) info.genre = bmsonInfo.genre
  if (bmsonInfo.level) info.level = bmsonInfo.level
  info.subtitles = getSubtitles()
  if (bmsonInfo.subartists) info.subartists = bmsonInfo.subartists
  return new BMS.SongInfo(info)

  function getSubtitles () {
    if (!bmson.version) return ['Warning: legacy bmson']
    let subtitles = []
    if (bmsonInfo.chart_name && typeof bmsonInfo.chart_name === 'string') {
      subtitles.push(bmsonInfo.chart_name)
    }
    if (bmsonInfo.subtitle && typeof bmsonInfo.subtitle === 'string') {
      subtitles.push(...bmsonInfo.subtitle.split('\n'))
    }
    return subtitles
  }
}

/**
 * Returns the barlines as an array of beats.
 * @param {Bmson} bmson
 */
export function barLinesForBmson (bmson) {
  if (!bmson.version) return legacy.barLinesForBmson(bmson)
  let beatForPulse = beatForPulseForBmson(bmson)
  let lines = bmson.lines
  return _(lines)
    .map(({ y }) => beatForPulse(y))
    .sortBy()
    .value()
}

/**
 * Returns the information to be passed to BMS.Timing constructor
 * in order to generate the timing data represented by the `bmson` object.
 * @param {Bmson} bmson
 */
export function timingInfoForBmson (bmson) {
  if (!bmson.version) return legacy.timingInfoForBmson(bmson)
  let beatForPulse = beatForPulseForBmson(bmson)
  return {
    initialBPM: bmson.info.init_bpm,
    actions: [
      ...(bmson.bpm_events || []).map(({ y, bpm }) => ({
        type: 'bpm',
        beat: beatForPulse(y),
        bpm: bpm
      })),
      ...(bmson.stop_events || []).map(({ y, duration }) => ({
        type: 'stop',
        beat: beatForPulse(y),
        stopBeats: beatForPulse(Math.floor(duration))
      }))
    ]
  }
}

/**
 * Returns the timing data represented by the `bmson` object.
 * @param {Bmson} bmson
 */
function timingForBmson (bmson) {
  let { initialBPM, actions } = timingInfoForBmson(bmson)
  return new BMS.Timing(initialBPM, actions)
}

/**
 * Returns the musical score (comprised of BMS.Notes and BMS.Keysounds).
 * @param {Bmson} bmson
 */
export function musicalScoreForBmson (bmson) {
  let timing = timingForBmson(bmson)
  let { notes, keysounds } = notesDataAndKeysoundsDataForBmsonAndTiming(
    bmson,
    timing
  )
  return {
    /**
     * The {BMS.Timing} object for this musical score.
     */
    timing,
    /**
     * A {BMS.Notes} representing notes inside the bmson notechart.
     */
    notes: new BMS.Notes(notes),
    /**
     * A {BMS.Keysounds} representing mapping between keysound in the
     * `notes` field to the actual keysound file name.
     */
    keysounds: new BMS.Keysounds(keysounds)
  }
}

function soundChannelsForBmson (bmson) {
  return bmson.version ? bmson.sound_channels : bmson.soundChannel
}

function notesDataAndKeysoundsDataForBmsonAndTiming (bmson, timing) {
  let nextKeysoundNumber = 1
  let beatForPulse = beatForPulseForBmson(bmson)
  let notes = []
  let keysounds = {}
  let soundChannels = soundChannelsForBmson(bmson)
  if (soundChannels) {
    for (let { name, notes: soundChannelNotes } of soundChannels) {
      let sortedNotes = _.sortBy(soundChannelNotes, 'y')
      let keysoundNumber = nextKeysoundNumber++
      let keysoundId = _.padStart('' + keysoundNumber, 4, '0')
      let slices = utils.slicesForNotesAndTiming(soundChannelNotes, timing, {
        beatForPulse: beatForPulse
      })

      keysounds[keysoundId] = name

      for (let { x, y, l } of sortedNotes) {
        let note = {
          column: getColumn(x),
          beat: beatForPulse(y),
          keysound: keysoundId,
          endBeat: undefined
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

export function beatForPulseForBmson (bmson) {
  if (!bmson.version) return legacy.beatForLoc
  const resolution = (bmson.info && bmson.info.resolution) || 240
  return y => y / resolution
}

function getColumn (x) {
  switch (x) {
    case 1:
      return '1'
    case 2:
      return '2'
    case 3:
      return '3'
    case 4:
      return '4'
    case 5:
      return '5'
    case 6:
      return '6'
    case 7:
      return '7'
    case 8:
      return 'SC'
  }
  return undefined
}

/**
 * Checks if there is a scratch in a bmson file
 * @param {Bmson} bmson
 */
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

/**
 * Checks the key mode for a bmson file
 * @param {Bmson} bmson
 */
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
