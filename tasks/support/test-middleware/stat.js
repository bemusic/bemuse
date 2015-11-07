
export default function calculateStat (specs) {
  let stat = { passed: 0, pending: 0, failed: 0, total: 0 }
  for (let spec of specs) {
    stat.total += 1
    if (spec.status === 'passed') {
      stat.passed += 1
    } else if (spec.status === 'pending') {
      stat.pending += 1
    } else {
      stat.failed += 1
    }
  }
  return stat
}
