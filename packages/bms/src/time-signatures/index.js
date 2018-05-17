
// Public: A module that exposes {TimeSignatures}
/* module */

// Public: A TimeSignatures is a collection of time signature values
// index by measure number.
//
// The measure number starts from 0.
// By default, each measure has a measure size of 1
// (which represents the common 4/4 time signature)
//
// ## Example
//
// If you have a BMS like this:
//
// ```
// #00102:0.75
// #00103:1.25
// ```
//
// Having parsed it using a {Compiler} into a {BMSChart},
// you can access the {TimeSignatures} object:
//
// ```js
// var timeSignatures = bmsChart.timeSignatures
// ```
//
// Note that you can also use the constructor
// to create a {TimeSignatures} from scratch.
//
// One of the most useful use case of this class
// is to convert the measure and fraction into beat number.
//
// ```js
// timeSignatures.measureToBeat(0, 0.000) // =>  0.0
// timeSignatures.measureToBeat(0, 0.500) // =>  2.0
// timeSignatures.measureToBeat(1, 0.000) // =>  4.0
// timeSignatures.measureToBeat(1, 0.500) // =>  5.5
// timeSignatures.measureToBeat(2, 0.000) // =>  7.0
// timeSignatures.measureToBeat(2, 0.500) // =>  9.5
// timeSignatures.measureToBeat(3, 0.000) // => 12.0
// ```
//
/* class TimeSignatures */

module.exports = TimeSignatures

// Public: Constructs an empty TimeSignatures.
//
function TimeSignatures () {
  this._values = { }
}

// Public: Sets the size of a specified measure.
//
// * `measure` {Number} representing the measure number, starting from 0
// * `value` {Number} representing the measure size.
//   For example, a size of 1.0 represents a common 4/4 time signature,
//   whereas a size of 0.75 represents the 3/4 or 6/8 time signature.
//
TimeSignatures.prototype.set = function (measure, value) {
  this._values[measure] = value
}

// Public: Retrieves the size of a specified measure.
//
// * `measure` {Number} representing the measure number.
//
// Returns a {Number} representing the size of the measure.
// By default, a measure has a size of 1.
//
TimeSignatures.prototype.get = function (measure) {
  return this._values[measure] || 1
}

// Public: Retrieves the number of beats in a specified measure.
//
// Since one beat is equivalent to a quarter note in 4/4 time signature,
// this is equivalent to `(timeSignatures.get(measure) * 4)`.
//
// * `measure` {Number} representing the measure number.
//
// Returns a {Number} representing the size of the measure in beats.
//
TimeSignatures.prototype.getBeats = function (measure) {
  return this.get(measure) * 4
}

// Public: Converts a measure number and a fraction inside that measure
// into the beat number.
//
// * `measure` {Number} representing the measure number.
// * `fraction` {Number} representing the fraction of a measure,
//   ranging from 0 (inclusive) to 1 (exclusive).
//
// Returns a {Number} representing the number of beats since measure 0.
//
TimeSignatures.prototype.measureToBeat = function (measure, fraction) {
  var sum = 0
  for (var i = 0; i < measure; i++) sum += this.getBeats(i)
  return sum + this.getBeats(measure) * fraction
}
