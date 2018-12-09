import _ from 'lodash'
import * as utils from './utils'
import { SoundChannel, Note } from './types'
import * as BMS from 'bms'

export interface LegacyBmson {
  soundChannel: SoundChannel[]
  lines: { y: number }[]
  info: {
    initBPM: number
  }
  bpmNotes: { y: number; v: number }[]
  stopNotes: { y: number; v: number }[]
}

export function barLinesForBmson(bmson: LegacyBmson) {
  let lines = bmson.lines
  return _(lines)
    .map(({ y }) => beatForLoc(y))
    .sortBy()
    .value()
}

export function timingInfoForBmson(bmson: LegacyBmson): utils.TimingInfo {
  return {
    initialBPM: bmson.info.initBPM,
    actions: [
      ...(bmson.bpmNotes || []).map(
        ({ y, v }) =>
          ({
            type: 'bpm',
            beat: beatForLoc(y),
            bpm: v,
          } as BMS.BPMTimingAction)
      ),
      ...(bmson.stopNotes || []).map(
        ({ y, v }) =>
          ({
            type: 'stop',
            beat: beatForLoc(y),
            stopBeats: beatForLoc(Math.floor(v)),
          } as BMS.StopTimingAction)
      ),
    ],
  }
}

export function beatForLoc(y: number) {
  return y / 240
}

function slicesForNotesAndTiming(notes: Note[], timing: BMS.Timing) {
  return utils.slicesForNotesAndTiming(notes, timing, {
    beatForPulse: beatForLoc,
  })
}

export { slicesForNotesAndTiming as _slicesForNotesAndTiming }
