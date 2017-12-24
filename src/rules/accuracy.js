export function calculateAccuracy (count, total) {
  return (count[0] + count[1] * 0.8 + count[2] * 0.5) / total
}

export function formatAccuracy (accuracy) {
  return (accuracy * 100).toFixed(2) + '%'
}

export function formattedAccuracyForRecord (record) {
  return formatAccuracy(calculateAccuracy(record.count, record.total))
}
