
import BMS       from 'bms'
import _         from 'lodash'
import Notechart from '../'

// Returns a new Notechart from a BMSChart.
export function fromBMSChart (bms, playerOptions) {
  let notes       = BMS.Notes.fromBMSChart(bms).all()
  let timing      = BMS.Timing.fromBMSChart(bms)
  let keysounds   = BMS.Keysounds.fromBMSChart(bms)
  let songInfo    = BMS.SongInfo.fromBMSChart(bms)
  let positioning = BMS.Positioning.fromBMSChart(bms)
  let spacing     = BMS.Spacing.fromBMSChart(bms)

  let data = {
    notes,
    timing,
    keysounds,
    songInfo,
    positioning,
    spacing,
    barLines: generateBarLinesFromBMS(notes, bms),
  }
  return new Notechart(data, playerOptions)
}

function generateBarLinesFromBMS (bmsNotes, bms) {
  let max             = _.max(bmsNotes.map(note => note.endBeat || note.beat))
  let barLines        = [ 0 ]
  let currentBeat     = 0
  let currentMeasure  = 0
  do {
    currentBeat += bms.timeSignatures.getBeats(currentMeasure)
    currentMeasure += 1
    barLines.push(currentBeat)
  } while (currentBeat <= max)
  return barLines
}
