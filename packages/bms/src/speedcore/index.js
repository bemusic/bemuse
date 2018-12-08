import { Segment } from './segment'

/**
 *
 * Speedcore is a small internally-used library.
 * A Speedcore represents a single dimensional keyframed linear motion
 * (as in equation x = f(t)), and is useful when working
 * with BPM changes ({Timing}), note spacing factor ({Spacing}), or scrolling
 * segments ({Positioning}).
 * A Speedcore is constructed from an array of Segments.
 *
 * A {Segment} is defined as `{ t, x, dx }`, such that:
 *
 * * speedcore.x(segment.t) = segment.x
 * * speedcore.t(segment.x) = segment.t
 * * speedcore.x(segment.t + dt) = segment.x + (segment.dx / dt)
 *
 *
 * ## Explanation
 *
 * One way to think of these segments is to think about tempo changes, where:
 *
 * * `t` is the elapsed time (in seconds) since song start.
 * * `x` is the elapsed beat since song start.
 * * `dx` is the amount of `x` increase per `t`. In this case, it has the
 *   unit of beats per second.
 *
 * For example, consider a song that starts at 140 BPM.
 * 32 beats later, the tempo changes to 160 BPM.
 * 128 beats later (at beat 160), the tempo reverts to 140 BPM.
 *
 * We can derive three segments:
 *
 * 1. At time 0, we are at beat 0, and moving at 2.333 beats per second.
 * 2. At 13.714s, we are at beat 32, moving at 2.667 beats per second.
 * 3. At 61.714s, we are at beat 160, moving at 2.333 beats per second.
 *
 * This maps out to this data structure:
 *
 * ```js
 * [ [0]: { t:  0.000,  x:   0,  dx: 2.333,  inclusive: true },
 *   [1]: { t: 13.714,  x:  32,  dx: 2.667,  inclusive: true },
 *   [2]: { t: 61.714,  x: 160,  dx: 2.333,  inclusive: true } ]
 * ```
 *
 * With this data, it is possible to find out the value of `x` at any given `t`.
 *
 * For example, to answer the question, “what is the beat number at 30s?”
 * First, we find the segment with maximum value of `t < 30`, and we get
 * the segment `[1]`.
 *
 * We calculate `segment.x + (t - segment.t) * segment.dx`.
 * The result beat number is (32 + (30 - 13.714) * 2.667) = 75.435.
 *
 * We can also perform the reverse calculation in a similar way, by reversing
 * the equation.
 *
 * Interestingly, we can use these segments to represent the effect of
 * both BPM changes and STOP segments in the same array.
 * For example, a 150-BPM song with a 2-beat stop in the 32nd beat
 * can be represented like this:
 *
 * ```js
 * [ [0]: { t:  0.0,  x:  0,  dx: 2.5,  inclusive: true  },
 *   [1]: { t: 12.8,  x: 32,  dx: 0,    inclusive: true  },
 *   [2]: { t: 13.6,  x: 32,  dx: 2.5,  inclusive: false } ]
 * ```
 */
export class Speedcore {
  /**
   * Constructs a new `Speedcore` from given segments.
   * @param {SpeedSegment[]} segments
   */
  constructor(segments) {
    this._segments = segments.map(Segment)
  }
  _reached(index, typeFn, position) {
    if (index >= this._segments.length) return false
    var segment = this._segments[index]
    var target = typeFn(segment)
    return segment.inclusive ? position >= target : position > target
  }
  _segmentAt(typeFn, position) {
    for (var i = 0; i < this._segments.length; i++) {
      if (!this._reached(i + 1, typeFn, position)) return this._segments[i]
    }
  }
  segmentAtX(x) {
    return this._segmentAt(X, x)
  }
  segmentAtT(t) {
    return this._segmentAt(T, t)
  }

  /**
   * Calculates the _t_, given _x_.
   * @param {number} x
   */
  t(x) {
    var segment = this.segmentAtX(x)
    return segment.t + (x - segment.x) / (segment.dx || 1)
  }

  /**
   * Calculates the _x_, given _t_.
   * @param {number} t
   */
  x(t) {
    var segment = this.segmentAtT(t)
    return segment.x + (t - segment.t) * segment.dx
  }

  /**
   * Finds the _dx_, given _t_.
   * @param {number} t
   */
  dx(t) {
    var segment = this.segmentAtT(t)
    return segment.dx
  }
}

var T = function(segment) {
  return segment.t
}
var X = function(segment) {
  return segment.x
}

/**
 * @typedef {Object} SpeedSegment
 * @property {number} t
 * @property {number} x
 * @property {number} dx the amount of change in x per t
 * @property {boolean} inclusive whether or not the segment includes the t
 */
