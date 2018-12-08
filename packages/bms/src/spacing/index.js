import { Speedcore } from '../speedcore'
import { BMSChart } from '../bms/chart'

/**
 * Public: A Spacing represents the relation between song beats and
 * notes spacing.
 *
 * In some rhythm games, such as Pump It Up!,
 * the speed (note spacing factor) may be adjusted by the notechart.
 * StepMania’s `#SPEED` segments is an example.
 */
export class Spacing {
  /**
   * Constructs a Spacing from the given `segments`.
   * @param {SpacingSegment[]} segments
   */
  constructor(segments) {
    if (segments.length > 0) {
      this._speedcore = new Speedcore(segments)
    }
  }

  /**
   * Returns the note spacing factor at the specified beat.
   * @param {*} beat the beat
   */
  factor(beat) {
    if (this._speedcore) {
      return this._speedcore.x(beat)
    } else {
      return 1
    }
  }

  /**
   * Creates a {Spacing} object from the {BMSChart}.
   *
   * ## `#SPEED` and `#xxxSP`
   *
   * Speed is defined as keyframes. These keyframes will be linearly interpolated.
   *
   * ```
   * #SPEED01 1.0
   * #SPEED02 2.0
   *
   * #001SP:01010202
   * ```
   *
   * In this example, the note spacing factor will gradually change
   * from 1.0x at beat 1 to 2.0x at beat 2.
   *
   * Returns a {Spacing} object
   *
   * @param {BMSChart} chart the chart
   */
  static fromBMSChart(chart) {
    void BMSChart
    var segments = []
    chart.objects.allSorted().forEach(function(object) {
      if (object.channel === 'SP') {
        var beat = chart.measureToBeat(object.measure, object.fraction)
        var factor = +chart.headers.get('speed' + object.value)
        if (isNaN(factor)) return
        if (segments.length > 0) {
          var previous = segments[segments.length - 1]
          previous.dx = (factor - previous.x) / (beat - previous.t)
        }
        segments.push({
          t: beat,
          x: factor,
          dx: 0,
          inclusive: true,
        })
      }
    })
    if (segments.length > 0) {
      segments.unshift({
        t: 0,
        x: segments[0].x,
        dx: 0,
        inclusive: true,
      })
    }
    return new Spacing(segments)
  }
}
/**
 * @typedef {Object} SpacingSegment
 * @property {number} t the beat number
 * @property {number} x the spacing at beat `t`
 * @property {number} dx the amount spacing factor change per beat,
 *  in order to create a continuous speed change
 * @property {boolean} inclusive whether or not to include the
 *  starting beat `t` as part of the segment
 */
