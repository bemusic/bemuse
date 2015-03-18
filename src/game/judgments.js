
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
  if (delta < 0.018) return 1
  if (delta < 0.040) return 2
  if (delta < 0.100) return 3
  if (delta < 0.200) return 4
  if (gameTime < noteTime) return 0
  return -1
}

export function breaksCombo(judgment) {
  return judgment === -1 || judgment >= 4
}
