import { timegate } from 'bemuse/game/judgments'

// For the purpose of displaying play accuracy statistics,
// given an array of deltas,
// we want to get filter it to contain only data for non-missed notes.
export function getNonMissedDeltas (deltas) {
  return deltas.filter(delta => Math.abs(delta) < timegate(4))
}

export default getNonMissedDeltas
