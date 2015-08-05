
// The Spacing module retrives the note spacing for a given beat

var Speedcore = require('../speedcore')
var _ = require('../util/lodash')

/**
 * @module spacing
 */
module.exports = Spacing

function Spacing(segments) {
  if (segments.length > 0) {
    this._speedcore = new Speedcore(segments)
  }
}

Spacing.prototype.factor = function(beat) {
  if (this._speedcore) {
    return this._speedcore.x(beat)
  } else {
    return 1
  }
}

Spacing.fromBMSChart = function(chart) {
  var segments = [ ]

  chart.objects.allSorted().forEach(function(object) {
    if (object.channel === 'SP') {
      var beat = chart.measureToBeat(object.measure, object.fraction)
      var factor = +chart.headers.get('speed' + object.value)
      if (isNaN(factor)) return
      if (segments.length > 0) {
        var previous = segments[segments.length - 1]
        previous.dx = (factor - previous.x) / (beat - previous.t)
      }
      segments.push({
        t: beat,
        x: factor,
        dx: 0,
        inclusive: true,
      })
    }
  })

  if (segments.length > 0) {
    segments.unshift({
      t: 0,
      x: segments[0].x,
      dx: 0,
      inclusive: true,
    })
  }

  return new Spacing(segments)
}
