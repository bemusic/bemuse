
// The Timing module converts between beats and seconds.
// They are created from a notechart.

var BPM  = require('./bpm')
var Stop = require('./stop')

module.exports = Timing

Timing.BPM  = BPM
Timing.Stop = Stop

function Timing(initialBPM, segments) {
  var state = new TimingState(0, 0, initialBPM)
  var graph = [state]
  segments = segments.slice()
  segments.sort(function(a, b) {
    return a.beat - b.beat || a.order - b.order
  })
  segments.forEach(function(segment) {
    var deltaBeat     = segment.beat - state.beat
    var deltaSeconds  = deltaBeat * 60 / state.bpm
    var beat          = segment.beat
    var seconds       = state.seconds + deltaSeconds
    if (segment instanceof BPM) {
      state = new TimingState(beat, seconds, segment.bpm)
      graph.push(state)
    } else if (segment instanceof Stop) {
      var bpm = state.bpm
      var stop = segment.stopBeats * 60 / bpm + segment.stopSeconds
      state = new TimingState(beat, seconds, 0)
      graph.push(state)
      state = new TimingState(beat, seconds + stop, bpm)
      graph.push(state)
    } else {
      throw new Error("Unrecognized segment object!")
    }
  })
  this._graph = graph
}

Timing.prototype.beatToSeconds = function(beat) {
  for (var i = 0; i < this._graph.length; i ++) {
    if (i + 1 >= this._graph.length || beat < this._graph[i + 1].beat) {
      var segment = this._graph[i]
      return segment.seconds + (beat - segment.beat) * 60 / segment.bpm
    }
  }
}

Timing.fromBMSChart = function(chart) {
  var segments = []
  chart.objects.all().forEach(function(object) {
    var bpm
    var beat = chart.measureToBeat(object.measure, object.fraction)
    if (object.channel === '03') {
      bpm = parseInt(object.value, 16)
      segments.push(new BPM(beat, bpm))
    } else if (object.channel === '08') {
      bpm = chart.headers.get('bpm' + object.value)
      segments.push(new BPM(beat, bpm))
    } else if (object.channel === '09') {
      var stopBeats = chart.headers.get('stop' + object.value) / 48
      segments.push(new Stop(beat, stopBeats, 0))
    }
  })
  return new Timing(+chart.headers.get('bpm') || 60, segments)
}

function TimingState(beat, seconds, bpm) {
  this.beat = beat
  this.seconds = seconds
  this.bpm = bpm
}

