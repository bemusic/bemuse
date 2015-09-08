
import * as bmson from 'bmson'
import Notechart  from 'bemuse/game/notechart'
import BMS        from 'bms'

export function load(source, options) {

  let data        = JSON.parse(source)
  let songInfo    = bmson.getSongInfo(data.info)
  let timing      = bmson.getTiming(data)
  let score       = bmson.getMusicalScore(data, timing)
  let barLines    = bmson.getBarLines(data.lines)

  let stuff = {
    notes:        score.notes.all(),
    timing,
    keysounds:    score.keysounds,
    songInfo,
    positioning:  new BMS.Positioning([
      { t: 0, x: 0, dx: 1, inclusive: true }
    ]),
    spacing:      new BMS.Spacing([ ]),
    barLines,
  }

  return new Notechart(stuff, options)
}
