
// Public: A module that exposes {Positioning}
/* module */

// Public: A Positioning represents the relation between song beats and
// display position, and provides a way to convert between them.
//
// In some rhythm games, the amount of scrolling per beat may be different.
// StepMania’s `#SCROLL` segments is an example.
//
/* class Positioning */

var Speedcore = require('../speedcore')

module.exports = Positioning

// Public: Constructs a Positioning from the given `segments`.
//
// * `segments` An {Array} of segment objects. Each segment {Object} contains:
//   * `t` {Number} representing the beat number
//   * `x` {Number} representing the total elapsed amount of scrolling at beat `t`
//   * `dx` {Number} representing the amount of scrolling per beat
//   * `inclusive` {Boolean} representing whether or not to include the
//     starting beat `t` as part of the segment
//
function Positioning (segments) {
  this._speedcore = new Speedcore(segments)
}

// Public: Returns the scrolling speed at specified beat.
//
// * `beat` {Number} representing the beat number
//
// Returns a {Number} representing the amount of scrolling per beat
//
Positioning.prototype.speed = function (beat) {
  return this._speedcore.dx(beat)
}

// Public: Returns the total elapsed scrolling amount at specified beat.
//
// * `beat` {Number} representing the beat number
//
// Returns a {Number} representing the total elapsed scrolling amount
//
Positioning.prototype.position = function (beat) {
  return this._speedcore.x(beat)
}

// Public: Creates a {Positioning} object from the {BMSChart}.
//
// * `chart` A {BMSChart} to construct a {Positioning} from
//
// Returns a {Positioning} object
//
Positioning.fromBMSChart = function (chart) {
  var segments = [ ]
  var x = 0
  segments.push({
    t: 0,
    x: x,
    dx: 1,
    inclusive: true,
  })

  chart.objects.allSorted().forEach(function (object) {
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
