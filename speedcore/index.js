
// Public: A module that exposes {Speedcore}
/* module */

// Speedcore is a small internally-used library.
// A Speedcore represents a single dimensional keyframed linear motion
// (as in equation x = f(t)), and is useful when working
// with BPM changes ({Timing}), note spacing factor ({Spacing}), or scrolling
// segments ({Positioning}).
// A Speedcore is constructed from an array of Segments.
//
// A {Segment} is defined as `{ t, x, dx }`, such that:
//
// * speedcore.x(segment.t) = segment.x
// * speedcore.t(segment.x) = segment.t
// * speedcore.x(segment.t + dt) = segment.x + (segment.dx / dt)
//
//
// ## Explanation
//
// One way to think of these segments is to think about tempo changes, where:
//
// * `t` is the elapsed time (in seconds) since song start.
// * `x` is the elapsed beat since song start.
// * `dx` is the amount of `x` increase per `t`. In this case, it has the
//   unit of beats per second.
//
// For example, consider a song that starts at 140 BPM.
// 32 beats later, the tempo changes to 160 BPM.
// 128 beats later (at beat 160), the tempo reverts to 140 BPM.
//
// We can derive three segments:
//
// 1. At time 0, we are at beat 0, and moving at 2.333 beats per second.
// 2. At 13.714s, we are at beat 32, moving at 2.667 beats per second.
// 3. At 61.714s, we are at beat 160, moving at 2.333 beats per second.
//
// This maps out to this data structure:
//
// ```js
// [ /* [0] */ { t:  0.000,  x:   0,  dx: 2.333,  inclusive: true },
//   /* [1] */ { t: 13.714,  x:  32,  dx: 2.667,  inclusive: true },
//   /* [2] */ { t: 61.714,  x: 160,  dx: 2.333,  inclusive: true } ]
// ```
//
// With this data, it is possible to find out the value of `x` at any given `t`.
//
// For example, to answer the question, “what is the beat number at 30s?”
// First, we find the segment with maximum value of `t < 30`, and we get
// the segment `[1]`.
//
// We calculate `segment.x + (t - segment.t) * segment.dx`.
// The result beat number is (32 + (30 - 13.714) * 2.667) = 75.435.
//
// We can also perform the reverse calculation in a similar way, by reversing
// the equation.
//
// Interestingly, we can use these segments to represent the effect of
// both BPM changes and STOP segments in the same array.
// For example, a 150-BPM song with a 2-beat stop in the 32nd beat
// can be represented like this:
//
// ```js
// [ /* [0] */ { t:  0.0,  x:  0,  dx: 2.5,  inclusive: true  },
//   /* [1] */ { t: 12.8,  x: 32,  dx: 0,    inclusive: true  },
//   /* [2] */ { t: 13.6,  x: 32,  dx: 2.5,  inclusive: false } ]
// ```
//
/* class Speedcore */

var Segment = require('./segment')
module.exports = Speedcore

// Public: Constructs a new `Speedcore` from given segments.
//
// * `segments` {Array} of {Segment} objects
//
function Speedcore (segments) {
  this._segments = segments.map(Segment)
}

var T = function (segment) { return segment.t }
var X = function (segment) { return segment.x }
Speedcore.prototype._reached = function (index, typeFn, position) {
  if (index >= this._segments.length) return false
  var segment = this._segments[index]
  var target  = typeFn(segment)
  return segment.inclusive ? position >= target : position > target
}

Speedcore.prototype._segmentAt = function (typeFn, position) {
  for (var i = 0; i < this._segments.length; i++) {
    if (!this._reached(i + 1, typeFn, position)) return this._segments[i]
  }
}

Speedcore.prototype.segmentAtX = function (x) {
  return this._segmentAt(X, x)
}

Speedcore.prototype.segmentAtT = function (t) {
  return this._segmentAt(T, t)
}

// Public: Calculates the _t_, given _x_.
//
// * `x` {Number} representing the value of _x_
//
// Returns {Number} _t_
//
Speedcore.prototype.t = function (x) {
  var segment = this.segmentAtX(x)
  return segment.t + (x - segment.x) / (segment.dx || 1)
}

// Public: Calculates the _x_, given _t_.
//
// * `t` {Number} representing the value of _t_
//
// Returns {Number} _x_
//
Speedcore.prototype.x = function (t) {
  var segment = this.segmentAtT(t)
  return segment.x + (t - segment.t) * segment.dx
}

// Public: Finds the _dx_, given _t_.
//
// * `t` {Number} representing the value of _t_
//
// Returns {Number} _dx_
//
Speedcore.prototype.dx = function (t) {
  var segment = this.segmentAtT(t)
  return segment.dx
}
