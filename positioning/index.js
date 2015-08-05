
// The Positioning module converts between beats and display position.

var Speedcore = require('../speedcore')
var _ = require('../util/lodash')

/**
 * @module positioning
 */
module.exports = Positioning

function Positioning(segments) {
  this._speedcore = new Speedcore(segments)
}

Positioning.prototype.speed = function(beat) {
  return this._speedcore.dx(beat)
}

Positioning.prototype.position = function(beat) {
  return this._speedcore.x(beat)
}

Positioning.fromBMSChart = function(chart) {
  var segments = [ ]
  var x = 0
  segments.push({
    t: 0,
    x: x,
    dx: 1,
    inclusive: true,
  })

  chart.objects.allSorted().forEach(function(object) {
    if (object.channel === 'SC') {
      var beat = chart.measureToBeat(object.measure, object.fraction)
      var dx = +chart.headers.get('scroll' + object.value)
      if (isNaN(dx)) return
      var previous = segments[segments.length - 1]
      x += (beat - previous.t) * previous.dx
      if (beat === 0 && segments.length === 1) {
        segments[0].dx = dx
      } else {
        segments.push({
          t: beat,
          x: x,
          dx: dx,
          inclusive: true,
        })
      }
    }
  })

  return new Positioning(segments)
}
