// Calculates the score as if it was computed by LR2.
//
// - `deltas` The array representing the player’s delta offsets in **seconds**.
// - `timegates` A 2-tuple containing **millisecond values**:
//     - `[0]` The timegate for PGREAT judgment.
//     - `[1]` The timegate for GREAT judgment.
//
// This module is implemented so that we can compare the difficulty
// of grading system in Bemuse to Lunatic Rave 2’s.
//
export function getLR2Score (deltas, [ meticulousWindow, preciseWindow ]) {
  let sum = 0
  for (const delta of deltas) {
    const difference = Math.abs(delta) * 1000
    if (difference < meticulousWindow) sum += 1
    if (difference < preciseWindow) sum += 1
  }
  return sum
}

export default getLR2Score
