import { Speedcore } from '../speedcore'
import { uniq, pluck } from '../util/lodash'
import { BMSChart } from '../bms/chart'

var precedence = { bpm: 1, stop: 2 }

/**
 * A Timing represents the timing information of a musical score.
 * A Timing object provides facilities to synchronize between
 * metric time (seconds) and musical time (beats).
 *
 * A Timing are created from a series of actions:
 *
 * - BPM changes.
 * - STOP action.
 */
export class Timing {
  /**
   * Constructs a Timing with an initial BPM and specified actions.
   *
   * Generally, you would use `Timing.fromBMSChart` to create an instance
   * from a BMSChart, but the constructor may also be used in other situations
   * unrelated to the BMS file format. (e.g. bmson package)
   * @param {number} initialBPM
   * @param {TimingAction[]} actions
   */
  constructor (initialBPM, actions) {
    var state = { bpm: initialBPM, beat: 0, seconds: 0 }
    var segments = []
    segments.push({
      t: 0,
      x: 0,
      dx: state.bpm / 60,
      bpm: state.bpm,
      inclusive: true
    })
    actions = actions.slice()
    actions.sort(function (a, b) {
      return a.beat - b.beat || precedence[a.type] - precedence[b.type]
    })
    actions.forEach(function (action) {
      var beat = action.beat
      var seconds = state.seconds + (beat - state.beat) * 60 / state.bpm
      switch (action.type) {
        case 'bpm':
          state.bpm = action.bpm
          segments.push({
            t: seconds,
            x: beat,
            dx: state.bpm / 60,
            bpm: state.bpm,
            inclusive: true
          })
          break
        case 'stop':
          segments.push({
            t: seconds,
            x: beat,
            dx: 0,
            bpm: state.bpm,
            inclusive: true
          })
          seconds += (action.stopBeats || 0) * 60 / state.bpm
          segments.push({
            t: seconds,
            x: beat,
            dx: state.bpm / 60,
            bpm: state.bpm,
            inclusive: false
          })
          break
        default:
          throw new Error('Unrecognized segment object!')
      }
      state.beat = beat
      state.seconds = seconds
    })
    this._speedcore = new Speedcore(segments)
    /**
     * @type {number[]}
     */
    this._eventBeats = uniq(pluck(actions, 'beat'), true)
  }

  /**
   * Convert the given beat into seconds.
   * @param {number} beat
   */
  beatToSeconds (beat) {
    return this._speedcore.t(beat)
  }

  /**
   * Convert the given second into beats.
   * @param {number} seconds
   */
  secondsToBeat (seconds) {
    return this._speedcore.x(seconds)
  }

  /**
   * Returns the BPM at the specified beat.
   * @param {number} beat
   */
  bpmAtBeat (beat) {
    return this._speedcore.segmentAtX(beat).bpm
  }

  /**
   * Returns an array representing the beats where there are events.
   */
  getEventBeats () {
    return this._eventBeats
  }

  /**
   * Creates a Timing instance from a BMSChart.
   * @param {BMSChart} chart
   */
  static fromBMSChart (chart) {
    void BMSChart
    var actions = []
    chart.objects.all().forEach(function (object) {
      var bpm
      var beat = chart.measureToBeat(object.measure, object.fraction)
      if (object.channel === '03') {
        bpm = parseInt(object.value, 16)
        actions.push({ type: 'bpm', beat: beat, bpm: bpm })
      } else if (object.channel === '08') {
        bpm = +chart.headers.get('bpm' + object.value)
        if (!isNaN(bpm)) actions.push({ type: 'bpm', beat: beat, bpm: bpm })
      } else if (object.channel === '09') {
        var stopBeats = chart.headers.get('stop' + object.value) / 48
        actions.push({ type: 'stop', beat: beat, stopBeats: stopBeats })
      }
    })
    return new Timing(+chart.headers.get('bpm') || 60, actions)
  }
}

/**
 * @typedef {Object} TimingAction represent timing change
 * @property {'bpm' | 'stop'} type `bpm` for BPM change, and `stop` for stop
 * @property {number} beat where this action occurs
 * @property {number} [bpm] BPM to change to (only for `bpm` type)
 * @property {number} [stopBeats] number of beats to stop (only for `stop` type)
 */
