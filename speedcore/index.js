
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
  this._segments = segments
}

Speedcore.prototype.t = function(x) {
  for (var i = 0; i < this._segments.length; i ++) {
    if (i + 1 >= this._segments.length || x <= this._segments[i + 1].x) {
      var segment = this._segments[i]
      return segment.t + (x - segment.x) / segment.dx
    }
  }
}

Speedcore.prototype.x = function(t) {
  for (var i = 0; i < this._segments.length; i ++) {
    if (i + 1 >= this._segments.length || t <= this._segments[i + 1].t) {
      var segment = this._segments[i]
      return segment.x + (t - segment.t) * segment.dx
    }
  }
}

/**
 * @class Segment
 */
/**
 * @property inclusive
 * @type Boolean
 */
/**
 * @property t
 * @type Number
 */
/**
 * @property x
 * @type Number
 */
/**
 * @property dx
 * @type Number
 */
