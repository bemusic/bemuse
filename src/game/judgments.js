
export const UNJUDGED = 0
export const MISSED = -1

export const JUDGMENTS = [
  { value: 1, timegate: 0.018 },
  { value: 2, timegate: 0.040 },
  { value: 3, timegate: 0.100 },
  { value: 4, timegate: 0.200 },
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
export function judgeTime(gameTime, noteTime) {
  let delta = Math.abs(gameTime - noteTime)
  for (let i = 0; i < JUDGMENTS.length; i ++) {
    if (delta < JUDGMENTS[i].timegate) return JUDGMENTS[i].value
  }
  return gameTime < noteTime ? UNJUDGED : MISSED
}

export function breaksCombo(judgment) {
  return judgment === MISSED || judgment >= 4
}
