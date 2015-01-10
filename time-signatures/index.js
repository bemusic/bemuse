
/**
 * @module time-signatures
 */
module.exports = TimeSignatures

/**
 * @class TimeSignatures
 * @constructor
 */
function TimeSignatures() {
  this._values = { }
}

/**
 * @method set
 * @param {Number} measure  The measure number
 * @param {Number} value    The time signature value. 1 represents 4/4, and
 *                          0.75 represents 3/4. You get the idea.
 */
TimeSignatures.prototype.set = function(measure, value) {
  this._values[measure] = value
}

/**
 * @method get
 * @param {Number} measure
 * @return {Number}
 */
TimeSignatures.prototype.get = function(measure) {
  return this._values[measure] || 1
}

/**
 * @method getBeats
 * @param {Number} measure
 * @return {Number}
 */
TimeSignatures.prototype.getBeats = function(measure) {
  return this.get(measure) * 4
}

/**
 * @method measureToBeat
 * @param {Number} measure
 * @param {Number} fraction
 */
TimeSignatures.prototype.measureToBeat = function(measure, fraction) {
  var sum = 0
  for (var i = 0; i < measure; i ++) sum += this.getBeats(i)
  return sum + this.getBeats(measure) * fraction
}

