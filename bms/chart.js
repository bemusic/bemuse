
/**
 * `BMSChart` holds information about a particular BMS notechart.
 *
 * @module bms/chart
 */

var BMSHeaders = require('./headers')
var BMSObjects = require('./objects')
var TimeSignatures = require('../time-signatures')

module.exports = BMSChart

/**
 * Generates an empty `BMSChart`.
 *
 * @class BMSChart
 * @constructor
 */
function BMSChart() {
  this.headers = new BMSHeaders()
  this.objects = new BMSObjects()
  this.timeSignatures = new TimeSignatures()
}

/**
 * Converts measure+fraction into beat.
 *
 * @method measureToBeat
 * @param {Number} measure   Measure number starting from 0
 * @param {Number} fraction  Fraction inside the measure (0 to 1)
 * @return {Number} The beat number starting from 0
 */
BMSChart.prototype.measureToBeat = function(measure, fraction) {
  return this.timeSignatures.measureToBeat(measure, fraction)
}

