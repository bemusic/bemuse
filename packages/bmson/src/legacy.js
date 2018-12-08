import _ from 'lodash'
import * as utils from './utils'

export function barLinesForBmson(bmson) {
  let lines = bmson.lines
  return _(lines)
    .map(({ y }) => beatForLoc(y))
    .sortBy()
    .value()
}

export function timingInfoForBmson(bmson) {
  return {
    initialBPM: bmson.info.initBPM,
    actions: [
      ...(bmson.bpmNotes || []).map(({ y, v }) => ({
        type: 'bpm',
        beat: beatForLoc(y),
        bpm: v,
      })),
      ...(bmson.stopNotes || []).map(({ y, v }) => ({
        type: 'stop',
        beat: beatForLoc(y),
        stopBeats: beatForLoc(Math.floor(v)),
      })),
    ],
  }
}

export function beatForLoc(y) {
  return y / 240
}

function slicesForNotesAndTiming(notes, timing) {
  return utils.slicesForNotesAndTiming(notes, timing, {
    beatForPulse: beatForLoc,
  })
}

export { slicesForNotesAndTiming as _slicesForNotesAndTiming }
