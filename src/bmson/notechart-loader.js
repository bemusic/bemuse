
import * as bmson from './index'
import Notechart  from 'bemuse/game/notechart'
import BMS        from 'bms'

export function load(source, options) {

  let data        = JSON.parse(source)
  let songInfo    = bmson.getSongInfo(data.info)
  let timingInfo  = bmson.getTimingInfo(data)
  let timing      = new BMS.Timing(timingInfo.initialBPM, timingInfo.actions)
  let score       = bmson.getMusicalScore(data)
  let barLines    = bmson.getBarLines(data.lines)

  let stuff = {
    notes:        score.notes.all(),
    timing,
    keysounds:    score.keysounds,
    songInfo,
    positioning:  new BMS.Positioning([ ]),
    spacing:      new BMS.Positioning([ ]),
    barLines,
  }

  return new Notechart(stuff, options)
}
