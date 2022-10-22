import { Note, BMSNote } from './note'
import invariant from 'invariant'
import * as ChannelMapping from './channels'
import { BMSChart } from '../bms/chart'
import { BMSObject } from '../bms/objects'

export { BMSNote }

/**
 * A Notes holds the {Note} objects in the game.
 * A note object may or may not be playable.
 *
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #00111:AA
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can create a {Notes} using `fromBMSChart()`:
 *
 * ```js
 * var notes = Notes.fromBMSChart(bmsChart)
 * ```
 *
 * Then you can get all notes using `.all()` method
 *
 * ```js
 * notes.all()
 * ```
 */
export class Notes {
  _notes: BMSNote[]
  static CHANNEL_MAPPING = ChannelMapping

  /**
   * @param {BMSNote[]} notes An array of Note objects
   */
  constructor(notes: BMSNote[]) {
    notes.forEach(Note)
    this._notes = notes
  }

  /**
   * Returns the number of notes in this object,
   * counting both playable and non-playable notes.
   */
  count() {
    return this._notes.length
  }

  /**
   * Returns an Array of all notes.
   */
  all() {
    return this._notes.slice()
  }

  /**
   * Creates a Notes object from a BMSChart.
   * @param chart the chart to process
   * @param options options
   */
  static fromBMSChart(chart: BMSChart, options?: BMSChartOptions) {
    void BMSChart
    options = options || {}
    const mapping = options.mapping || Notes.CHANNEL_MAPPING.IIDX_P1
    const builder = new BMSNoteBuilder(chart, { mapping: mapping })
    return builder.build()
  }
}

class BMSNoteBuilder {
  _chart: BMSChart
  _mapping: { [channel: string]: string }
  _notes: BMSNote[]
  _activeLN: { [channel: string]: BMSNote }
  _lastNote: { [channel: string]: BMSNote }
  _lnObj: string
  _channelMapping: { [channel: string]: string }
  _objects: BMSObject[]
  constructor(chart: BMSChart, options: { mapping: BMSChannelNoteMapping }) {
    this._chart = chart
    invariant(options.mapping, 'Expected options.mapping')
    invariant(
      typeof options.mapping === 'object',
      'options.mapping must be object'
    )
    this._mapping = options.mapping
    this._notes = []
    this._activeLN = {}
    this._lastNote = {}
    this._lnObj = (this._chart.headers.get('lnobj') || '').toLowerCase()
    this._channelMapping = this._mapping
    this._objects = this._chart.objects.allSorted()
  }

  build() {
    this._objects.forEach((object) => {
      this._handle(object)
    })
    return new Notes(this._notes)
  }

  _handle(object: BMSObject) {
    if (object.channel === '01') {
      this._handleNormalNote(object)
    } else {
      switch (object.channel.charAt(0).toUpperCase()) {
        case '1':
        case '2':
        case 'D':
        case 'E':
          this._handleNormalNote(object)
          break
        case '5':
        case '6':
          this._handleLongNote(object)
          break
      }
    }
  }

  _handleNormalNote(object: BMSObject) {
    const channel = this._normalizeChannel(object.channel)
    const beat = this._getBeat(object)
    if (object.value.toLowerCase() === this._lnObj) {
      if (this._lastNote[channel]) {
        this._lastNote[channel].endBeat = beat
      }
    } else {
      const note = {
        beat: beat,
        endBeat: undefined,
        keysound: object.value,
        column: this._getColumn(channel),
      }
      this._lastNote[channel] = note
      this._notes.push(note)
    }
  }

  _handleLongNote(object: BMSObject) {
    const channel = this._normalizeChannel(object.channel)
    const beat = this._getBeat(object)
    if (this._activeLN[channel]) {
      const note = this._activeLN[channel]
      note.endBeat = beat
      this._notes.push(note)
      delete this._activeLN[channel]
    } else {
      this._activeLN[channel] = {
        beat: beat,
        keysound: object.value,
        column: this._getColumn(channel),
      }
    }
  }

  _getBeat(object: BMSObject) {
    return this._chart.measureToBeat(object.measure, object.fraction)
  }

  _getColumn(channel: string) {
    return this._channelMapping[channel]
  }

  _normalizeChannel(channel: string) {
    return channel.replace(/^5/, '1').replace(/^6/, '2')
  }
}

interface BMSChartOptions {
  /**
   * The mapping from BMS channel to game channel.
   * Default value is the IIDX_P1 mapping.
   */
  mapping?: BMSChannelNoteMapping
}

type BMSChannelNoteMapping = { [channel: string]: string }
