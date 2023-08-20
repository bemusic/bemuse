// #region grade
export function getGrade(stats) {
  const score = stats.score
  if (score < 250000) return 'E'
  if (score < 300000) return 'F'
  if (score < 350000) return 'D'
  if (score < 400000) return 'C'
  if (score < 450000) return 'B'
  if (score < 500000) return 'A'
  if (score < 555555) return 'S'
  return 'X'
}
// #endregion
