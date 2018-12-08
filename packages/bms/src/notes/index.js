import { Note } from './note'
import invariant from 'invariant'
import * as ChannelMapping from './channels'
import { BMSChart } from '../bms/chart'

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
  /**
   * @param {BMSNote[]} notes An array of Note objects
   */
  constructor(notes) {
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
   * @param {BMSChart} chart the chart to process
   * @param {BMSChartOptions} options options
   */
  static fromBMSChart(chart, options) {
    void BMSChart
    options = options || {}
    var mapping = options.mapping || Notes.CHANNEL_MAPPING.IIDX_P1
    var builder = new BMSNoteBuilder(chart, { mapping: mapping })
    return builder.build()
  }
}

Notes.CHANNEL_MAPPING = ChannelMapping

class BMSNoteBuilder {
  constructor(chart, options) {
    this._chart = chart
    invariant(options.mapping, 'Expected options.mapping')
    invariant(
      typeof options.mapping === 'object',
      'options.mapping must be object'
    )
    this._mapping = options.mapping
  }
  build() {
    this._notes = []
    this._activeLN = {}
    this._lastNote = {}
    this._lnObj = (this._chart.headers.get('lnobj') || '').toLowerCase()
    this._channelMapping = this._mapping
    this._objects = this._chart.objects.allSorted()
    this._objects.forEach(
      function(object) {
        this._handle(object)
      }.bind(this)
    )
    return new Notes(this._notes)
  }
  _handle(object) {
    if (object.channel === '01') {
      this._handleNormalNote(object)
    } else {
      switch (object.channel.charAt(0)) {
        case '1':
        case '2':
          this._handleNormalNote(object)
          break
        case '5':
        case '6':
          this._handleLongNote(object)
          break
      }
    }
  }
  _handleNormalNote(object) {
    var channel = this._normalizeChannel(object.channel)
    var beat = this._getBeat(object)
    if (object.value.toLowerCase() === this._lnObj) {
      if (this._lastNote[channel]) {
        this._lastNote[channel].endBeat = beat
      }
    } else {
      var note = {
        beat: beat,
        endBeat: undefined,
        keysound: object.value,
        column: this._getColumn(channel),
      }
      this._lastNote[channel] = note
      this._notes.push(note)
    }
  }
  _handleLongNote(object) {
    var channel = this._normalizeChannel(object.channel)
    var beat = this._getBeat(object)
    if (this._activeLN[channel]) {
      var note = this._activeLN[channel]
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
  _getBeat(object) {
    return this._chart.measureToBeat(object.measure, object.fraction)
  }
  _getColumn(channel) {
    return this._channelMapping[channel]
  }
  _normalizeChannel(channel) {
    return channel.replace(/^5/, '1').replace(/^6/, '2')
  }
}
/**
 * @typedef {Object} BMSNote A single note in a notechart.
 * @property {number} beat
 * @property {number} [endBeat]
 * @property {string} [column]
 * @property {string} keysound
 */
/**
 * @typedef {Object} BMSChartOptions
 * @property {{[channel: string]: string}} [mapping]
 *  the mapping from BMS channel to game channel.
 *  Default value is the IIDX_P1 mapping.
 */
