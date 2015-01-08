
var BMSHeaders = require('./headers')
var BMSObjects = require('./objects')
var BMSTimeSignatures = require('./time-signatures')

module.exports = BMSChart

function BMSChart() {
  this.headers = new BMSHeaders()
  this.objects = new BMSObjects()
  this.timeSignatures = new BMSTimeSignatures()
}

BMSChart.prototype.measureToBeat = function(measure, fraction) {
  return this.timeSignatures.measureToBeat(measure, fraction)
}

