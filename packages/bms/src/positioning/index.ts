import { Speedcore } from '../speedcore'
import { BMSChart } from '../bms/chart'
import { SpeedSegment } from '../speedcore/segment'

/**
 * A Positioning represents the relation between song beats and
 * display position, and provides a way to convert between them.
 *
 * In some rhythm games, the amount of scrolling per beat may be different.
 * StepMania’s `#SCROLL` segments is an example.
 */
export class Positioning {
  _speedcore: Speedcore
  /**
   * Constructs a Positioning from the given `segments`.
   * @param segments
   */
  constructor(segments: PositioningSegment[]) {
    this._speedcore = new Speedcore(segments)
  }

  /**
   * Returns the scrolling speed at specified beat.
   * @param beat the beat number
   */
  speed(beat: number) {
    return this._speedcore.dx(beat)
  }

  /**
   * Returns the total elapsed scrolling amount at specified beat.
   * @param beat the beat number
   */
  position(beat: number) {
    return this._speedcore.x(beat)
  }

  /**
   * Creates a {Positioning} object from the {BMSChart}.
   * @param {BMSChart} chart A {BMSChart} to construct a {Positioning} from
   */
  static fromBMSChart(chart: BMSChart) {
    void BMSChart
    const segments: SpeedSegment[] = []
    let x = 0
    segments.push({
      t: 0,
      x: x,
      dx: 1,
      inclusive: true,
    })
    chart.objects.allSorted().forEach(function (object) {
      if (object.channel === 'SC') {
        const beat = chart.measureToBeat(object.measure, object.fraction)
        const dx = +chart.headers.get('scroll' + object.value)!
        if (isNaN(dx)) return
        const previous = segments[segments.length - 1]
        x += (beat - previous.t) * previous.dx
        if (beat === 0 && segments.length === 1) {
          segments[0].dx = dx
        } else {
          segments.push({
            t: beat,
            x: x,
            dx: dx,
            inclusive: true,
          })
        }
      }
    })
    return new Positioning(segments)
  }
}

export interface PositioningSegment extends SpeedSegment {
  /** the beat number */
  t: number
  /** the total elapsed amount of scrolling at beat `t` */
  x: number
  /** the amount of scrolling per beat */
  dx: number
  /** whether or not to include the
   starting beat `t` as part of the segment */
  inclusive: boolean
}
