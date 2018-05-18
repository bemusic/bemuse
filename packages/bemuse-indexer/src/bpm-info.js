import _ from 'lodash'

export function getBpmInfo (notes, timing) {
  var maxBeat = _(notes.all())
    .map('beat')
    .max()
  var beats = _(timing.getEventBeats())
    .concat([0, maxBeat])
    .sortBy()
    .uniq()
    .filter(function (beat) {
      return beat <= maxBeat
    })
    .value()
  var data = []
  for (var i = 0; i + 1 < beats.length; i++) {
    var length =
      timing.beatToSeconds(beats[i + 1]) - timing.beatToSeconds(beats[i])
    var bpm = timing.bpmAtBeat(beats[i])
    data.push([bpm, length])
  }
  var getPercentile = percentile(data)
  return {
    init: timing.bpmAtBeat(0),
    min: getPercentile(2),
    median: getPercentile(50),
    max: getPercentile(98)
  }
}

function percentile (data) {
  data = _.sortBy(data, 0)
  var total = _.sumBy(data, 1)
  return function (percentileNo) {
    var current = 0
    for (var i = 0; i < data.length; i++) {
      current += data[i][1]
      if (current / total >= percentileNo / 100) return data[i][0]
    }
  }
}
