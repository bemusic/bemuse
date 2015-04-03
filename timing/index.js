
// The Timing module converts between beats and seconds.
// They are created from a notechart.

var Speedcore = require('../speedcore')

/**
 * @module timing
 */
module.exports = Timing

var precedence = { bpm: 1, stop: 2 }

function Timing(initialBPM, actions) {
  var state = { bpm: initialBPM, beat: 0, seconds: 0 }
  var segments = [ ]
  segments.push({
    t: 0,
    x: 0,
    dx: state.bpm / 60,
    bpm: state.bpm,
    inclusive: true,
  })
  actions = actions.slice()
  actions.sort(function(a, b) {
    return a.beat - b.beat || precedence[a.type] - precedence[b.type]
  })
  actions.forEach(function(action) {
    var beat    = action.beat
    var seconds = state.seconds + (beat - state.beat) * 60 / state.bpm
    switch (action.type) {
    case 'bpm':
      state.bpm = action.bpm
      segments.push({
        t: seconds,
        x: beat,
        dx: state.bpm / 60,
        bpm: state.bpm,
        inclusive: true,
      })
      break
    case 'stop':
      segments.push({
        t: seconds,
        x: beat,
        dx: 0,
        bpm: state.bpm,
        inclusive: true,
      })
      seconds += (action.stopBeats || 0) * 60 / state.bpm
      segments.push({
        t: seconds,
        x: beat,
        dx: state.bpm / 60,
        bpm: state.bpm,
        inclusive: false,
      })
      break
    default:
      throw new Error("Unrecognized segment object!")
    }
    state.beat    = beat
    state.seconds = seconds
  })
  this._speedcore = new Speedcore(segments)
}

Timing.prototype.beatToSeconds = function(beat) {
  return this._speedcore.t(beat)
}

Timing.prototype.secondsToBeat = function(seconds) {
  return this._speedcore.x(seconds)
}

Timing.prototype.bpmAtBeat = function(beat) {
  return this._speedcore.segmentAtX(beat).bpm
}

Timing.fromBMSChart = function(chart) {
  var actions = []
  chart.objects.all().forEach(function(object) {
    var bpm
    var beat = chart.measureToBeat(object.measure, object.fraction)
    if (object.channel === '03') {
      bpm = parseInt(object.value, 16)
      actions.push({ type: 'bpm', beat: beat, bpm: bpm })
    } else if (object.channel === '08') {
      bpm = chart.headers.get('bpm' + object.value)
      actions.push({ type: 'bpm', beat: beat, bpm: bpm })
    } else if (object.channel === '09') {
      var stopBeats = chart.headers.get('stop' + object.value) / 48
      actions.push({ type: 'stop', beat: beat, stopBeats: stopBeats })
    }
  })
  return new Timing(+chart.headers.get('bpm') || 60, actions)
}

