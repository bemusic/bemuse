
import R from 'ramda'

export const UNJUDGED = 0
export const MISSED = -1

export const JUDGMENTS = [
  { value: 1, timegate: 0.020, endTimegate: 0.040 },
  { value: 2, timegate: 0.050, endTimegate: 0.100 },
  { value: 3, timegate: 0.100, endTimegate: 0.200 },
  { value: 4, timegate: 0.200, endTimegate: 0.200 },
]

/**
 * Takes a gameTime and noteTime and returns the appropriate judgment.
 *
 *  1 - METICULOUS
 *  2 - PRECISE
 *  3 - GOOD
 *  4 - OFFBEAT
 *  0 - (not judge)
 * -1 - MISSED
 */
export function judgeTimeWith(f) {
  return function judgeTimeWithF(gameTime, noteTime) {
    let delta = Math.abs(gameTime - noteTime)
    for (let i = 0; i < JUDGMENTS.length; i ++) {
      if (delta < f(JUDGMENTS[i])) return JUDGMENTS[i].value
    }
    return gameTime < noteTime ? UNJUDGED : MISSED
  }
}

export const judgeTime    = judgeTimeWith(R.prop('timegate'))
export const judgeEndTime = judgeTimeWith(R.prop('endTimegate'))

export function isBad(judgment) {
  return judgment >= 4
}

export function breaksCombo(judgment) {
  return judgment === MISSED || isBad(judgment)
}


