import { Speedcore } from '../speedcore'
import { BMSChart } from '../bms/chart'
import { SpeedSegment } from '../speedcore/segment'

/**
 * A Positioning represents the relation between song beats and
 * displayed in-game position. Some rhythm games lets chart author
 * control the amount of scrolling per beat. In StepMania 5,
 * this is called the “scroll segments”.
 * This class lets you convert between song beats and in-game position.
 *
 * @public
 */
export class Positioning {
  private _speedcore: Speedcore

  /**
   * Constructs a {@link Positioning} object from the given `segments`.
   */
  constructor(segments: PositioningSegment[]) {
    this._speedcore = new Speedcore(segments)
  }

  /**
   * Returns the scrolling speed at specified beat.
   * @param beat - The beat number
   */
  speed(beat: number) {
    return this._speedcore.dx(beat)
  }

  /**
   * Returns the total elapsed scrolling amount at specified beat.
   * @param beat - The beat number
   */
  position(beat: number) {
    return this._speedcore.x(beat)
  }

  /**
   * Creates a {@link Positioning} object from a {@link BMSChart}.
   * @param chart - A BMSChart to construct a Positioning from
   */
  static fromBMSChart(chart: BMSChart) {
    void BMSChart
    var segments: SpeedSegment[] = []
    var x = 0
    segments.push({
      t: 0,
      x: x,
      dx: 1,
      inclusive: true,
    })
    chart.objects.allSorted().forEach(function (object) {
      if (object.channel === 'SC') {
        var beat = chart.measureToBeat(object.measure, object.fraction)
        var dx = +chart.headers.get('scroll' + object.value)!
        if (isNaN(dx)) return
        var previous = segments[segments.length - 1]
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

/**
 * @public
 */
export interface PositioningSegment extends SpeedSegment {
  /** The beat number */
  t: number
  /** The total elapsed amount of scrolling at beat `t` */
  x: number
  /** The amount of scrolling per beat */
  dx: number
  /** Whether or not to include the starting beat `t` as part of the segment */
  inclusive: boolean
}
