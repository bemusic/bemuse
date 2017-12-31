/**
 * Calculates the accuracy.
 * @param {number[]} count The 3-element array containing METICULOUS judgment,
 * PRECISE judgment, and GOOD judgment, respectively.
 * @param {number} total The total amount of possible judgments that may be given.
 * @returns the accuracy number, from 0 to 1
 */
export function calculateAccuracy (count, total) {
  return (count[0] + count[1] * 0.8 + count[2] * 0.5) / total
}

/**
 * Format the accuracy number.
 */
export function formatAccuracy (accuracy) {
  return (accuracy * 100).toFixed(2) + '%'
}

/**
 * Returns the accuracy number for a play record.
 */
export function formattedAccuracyForRecord (record) {
  return formatAccuracy(calculateAccuracy(record.count, record.total))
}
