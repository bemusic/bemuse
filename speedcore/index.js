
// Public: A module that exposes {Speedcore}
/* module */

// Speedcore is a small internally-used library.
// A Speedcore represents a single dimensional keyframed linear motion
// (as in equation x = f(t)), and is useful when working
// with BPM changes ({Timing}), note spacing factor ({Spacing}), or scrolling
// segments ({Positioning}).
// A Speedcore is constructed from an array of Segments.
//
// A Segment is defined as a tuple of (t, x, dx), such that:
//
// * speedcore.x(segment.t) = segment.x
// * speedcore.t(segment.x) = segment.t
// * speedcore.x(segment.t + dt) = segment.x + (segment.dx / dt)
//
/* class Speedcore */

var Segment = require('./segment')
module.exports = Speedcore

// Public: Constructs a new `Speedcore` from given segments.
//
// * `segments` {Array} of {Segment} objects
//
function Speedcore(segments) {
  this._segments = segments.map(Segment)
}

var T = function(segment) { return segment.t }
var X = function(segment) { return segment.x }
Speedcore.prototype._reached = function(index, typeFn, position) {
  if (index >= this._segments.length) return false
  var segment = this._segments[index]
  var target  = typeFn(segment)
  return segment.inclusive ? position >= target : position > target
}

Speedcore.prototype._segmentAt = function(typeFn, position) {
  for (var i = 0; i < this._segments.length; i ++) {
    if (!this._reached(i + 1, typeFn, position)) return this._segments[i]
  }
}

Speedcore.prototype.segmentAtX = function(x) {
  return this._segmentAt(X, x)
}

Speedcore.prototype.segmentAtT = function(t) {
  return this._segmentAt(T, t)
}

// Public: Calculates the _t_, given _x_.
//
// * `x` {Number} representing the value of _x_
//
// Returns {Number} _t_
//
Speedcore.prototype.t = function(x) {
  var segment = this.segmentAtX(x)
  return segment.t + (x - segment.x) / (segment.dx || 1)
}

// Public: Calculates the _x_, given _t_.
//
// * `t` {Number} representing the value of _t_
//
// Returns {Number} _x_
//
Speedcore.prototype.x = function(t) {
  var segment = this.segmentAtT(t)
  return segment.x + (t - segment.t) * segment.dx
}

// Public: Finds the _dx_, given _t_.
//
// * `t` {Number} representing the value of _t_
//
// Returns {Number} _dx_
//
Speedcore.prototype.dx = function(t) {
  var segment = this.segmentAtT(t)
  return segment.dx
}
