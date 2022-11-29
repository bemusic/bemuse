import React, { memo } from 'react'
import { createSelector, createStructuredSelector } from 'reselect'

import getNonMissedDeltas from '../interactors/getNonMissedDeltas'
import mean from 'mean'
import variance from 'variance'

const getStats = (() => {
  const selectMean = createSelector(getNonMissedDeltas, (deltas) =>
    mean(deltas)
  )
  const selectStandardDeviation = createSelector(getNonMissedDeltas, (deltas) =>
    Math.sqrt(variance(deltas))
  )
  const selectStats = createStructuredSelector({
    mean: selectMean,
    standardDeviation: selectStandardDeviation,
  })
  return selectStats
})()

function formatOffset(n: number) {
  return (n === 0 ? '' : n < 0 ? '-' : '+') + formatDuration(Math.abs(n))
}

function formatDuration(n: number) {
  return (n * 1000).toFixed(1)
}

export interface ResultExpertInfoProps {
  deltas: readonly number[]
}

const ResultExpertInfo = ({ deltas }: ResultExpertInfoProps) => {
  const stats = getStats(deltas)
  return (
    <span>
      <span
        style={{ cursor: 'help' }}
        title='Average and standard deviation of your keypresses.'
      >
        {formatOffset(stats.mean)} ± {formatDuration(stats.standardDeviation)}
        ms
      </span>
    </span>
  )
}

export default memo(ResultExpertInfo)
