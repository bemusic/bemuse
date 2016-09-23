import mean from 'mean'
import variance from 'variance'
import React from 'react'
import { createSelector, createStructuredSelector } from 'reselect'

import getNonMissedDeltas from '../interactors/getNonMissedDeltas'

export default class ResultExpertInfo extends React.Component {
  static propTypes = {
    deltas: React.PropTypes.array,
    meticulousWindow: React.PropTypes.number,
    preciseWindow: React.PropTypes.number,
    noteCount: React.PropTypes.number
  }
  getStats = (() => {
    const selectExpertScore = createSelector(
      (props) => props.deltas,
      (props) => props.meticulousWindow,
      (props) => props.preciseWindow,
      (deltas, meticulousWindow, preciseWindow) => {
        let sum = 0
        for (const delta of deltas) {
          const difference = Math.abs(delta)
          if (difference < meticulousWindow) sum += 1
          if (difference < preciseWindow) sum += 1
        }
        return sum
      }
    )
    const selectNonMissedDeltas = createSelector(
      (props) => props.deltas,
      (deltas) => getNonMissedDeltas(deltas)
    )
    const selectMean = createSelector(
      selectNonMissedDeltas,
      (deltas) => mean(deltas)
    )
    const selectStandardDeviation = createSelector(
      selectNonMissedDeltas,
      (deltas) => Math.sqrt(variance(deltas))
    )
    const selectStats = createStructuredSelector({
      expertScore: selectExpertScore,
      mean: selectMean,
      standardDeviation: selectStandardDeviation
    })
    return () => selectStats(this.props)
  })()
  render () {
    const stats = this.getStats()
    return <span>
      {formatOffset(stats.mean)} ± {formatDuration(stats.standardDeviation)}ms
      {' · '}
      {stats.expertScore} / {this.props.noteCount * 2}
    </span>
  }
}

function formatOffset (n) {
  return (n === 0 ? '' : (n < 0 ? '-' : '+')) + formatDuration(Math.abs(n))
}

function formatDuration (n) {
  return (n * 1000).toFixed(1)
}
