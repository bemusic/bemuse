import _ from 'lodash'
import * as BMS from 'bms'

export function getBpmInfo(notes: BMS.Notes, timing: BMS.Timing) {
  const maxBeat = _(notes.all()).map('beat').max() || 0
  const beats = _(timing.getEventBeats())
    .concat([0, maxBeat])
    .sortBy()
    .uniq()
    .filter((beat) => beat! <= maxBeat)
    .value()
  const data: [number, number][] = []
  for (let i = 0; i + 1 < beats.length; i++) {
    const length =
      timing.beatToSeconds(beats[i + 1]) - timing.beatToSeconds(beats[i])
    const bpm = timing.bpmAtBeat(beats[i])
    data.push([bpm, length])
  }
  const getPercentile = percentile(data)
  return {
    init: timing.bpmAtBeat(0),
    min: getPercentile(2),
    median: getPercentile(50),
    max: getPercentile(98),
  }
}

function percentile(data: [number, number][]) {
  data = _.sortBy(data, 0)
  const total = _.sumBy(data, '1')
  return (percentileNo: number) => {
    let current = 0
    for (let i = 0; i < data.length; i++) {
      current += data[i][1]
      if (current / total >= percentileNo / 100) return data[i][0]
    }
    return 0
  }
}
