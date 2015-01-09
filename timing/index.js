
// The Timing module converts between beats and seconds.
// They are created from a notechart.

module.exports = Timing

function Timing(initialBPM, segments) {
  var state = new TimingState(0, 0, initialBPM)
  var graph = [state]
  segments = segments.slice()
  segments.sort(function(a, b) { return a.beat - b.beat })
  segments.forEach(function(segment) {
    var deltaBeat     = segment.beat - state.beat
    var deltaSeconds  = deltaBeat * 60 / state.bpm
    var beat          = segment.beat
    var seconds       = state.seconds + deltaSeconds
    if (segment instanceof BPM) {
      state = new TimingState(beat, seconds, segment.bpm)
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
    }
  })
  return new Timing(+chart.headers.get('bpm') || 60, segments)
}

function BPM(beat, bpm) {
  this.beat = beat
  this.bpm = bpm
}

function TimingState(beat, seconds, bpm) {
  this.beat = beat
  this.seconds = seconds
  this.bpm = bpm
}

