
var Segment = require('./segment')

/**
 * Speedcore is a library to help compute the speed and position
 * of linear motion. A Speedcore is constructed from an array of Segments.
 *
 * @module speedcore
 */
module.exports = Speedcore

/**
 * Construct a new `Speedcore` from segments
 *
 * @class Speedcore
 * @constructor
 * @param {Segment[]} segments  An array of segments.
 */
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

Speedcore.prototype.t = function(x) {
  var segment = this.segmentAtX(x)
  return segment.t + (x - segment.x) / (segment.dx || 1)
}

Speedcore.prototype.x = function(t) {
  var segment = this.segmentAtT(t)
  return segment.x + (t - segment.t) * segment.dx
}

Speedcore.prototype.dx = function(t) {
  var segment = this.segmentAtT(t)
  return segment.dx
}
