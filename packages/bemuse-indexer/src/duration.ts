import _ from 'lodash'
import * as BMS from 'bms'

export function getDuration(notes: BMS.Notes, timing: BMS.Timing) {
  var maxBeat =
    _(notes.all())
      .map('beat')
      .max() || 0
  return timing.beatToSeconds(maxBeat)
}
