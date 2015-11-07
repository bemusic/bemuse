
// Public: A module that exposes {BMSChart}.
/* module */

var BMSHeaders = require('./headers')
var BMSObjects = require('./objects')
var TimeSignatures = require('../time-signatures')

module.exports = BMSChart

// Public: A BMSChart holds information about a particular BMS notechart.
// Note that a BMSChart does not contain any information about `#RANDOM`,
// as they are already processed after compilation.
//
// There is not many useful things you can do with a BMSChart other than
// accessing the header fields and objects inside it.
//
// To extract information from a BMSChart,
// please look at the documentation of higher-level classes,
// such as {Keysounds}, {Notes}, and {Timing}.
//
/* class BMSChart */

// Public: Constructs an empty {BMSChart}
//
function BMSChart () {

  // Public: {BMSHeaders} representing the BMS-specific headers of this notechart
  this.headers = new BMSHeaders()

  // Public: {BMSObjects} representing all objects of this notechart
  this.objects = new BMSObjects()

  // Public: {TimeSignatures} representing the time signature information in this chart
  this.timeSignatures = new TimeSignatures()
}

// Public: Converts measure number and fraction into beat.
// A single beat is equivalent to a quarter note in common time signature.
//
// * `measure` {Number} representing the measure number, starting from 0
// * `fraction` {Number} representing the fraction inside that measure, from 0 to 1
//
// Returns the {Number} representing the beat number, starting from 0
//
BMSChart.prototype.measureToBeat = function (measure, fraction) {
  return this.timeSignatures.measureToBeat(measure, fraction)
}
