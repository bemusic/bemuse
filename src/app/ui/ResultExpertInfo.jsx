import mean from 'mean'
import variance from 'variance'
import React from 'react'
import { createSelector, createStructuredSelector } from 'reselect'

import getLR2Score from '../interactors/getLR2Score'
import getNonMissedDeltas from '../interactors/getNonMissedDeltas'

export default class ResultExpertInfo extends React.Component {
  static propTypes = {
    deltas: React.PropTypes.array,
    lr2Timegate: React.PropTypes.array,
    noteCount: React.PropTypes.number
  }
  getStats = (() => {
    const selectExpertScore = createSelector(
      (props) => props.deltas,
      (props) => props.lr2Timegate,
      getLR2Score
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
      <span
        style={{ cursor: 'help' }}
        title="Average and standard deviation of your keypresses."
      >
        {formatOffset(stats.mean)} ± {formatDuration(stats.standardDeviation)}ms
      </span>
      {' · '}
      <span
        style={{ cursor: 'help' }}
        title="The score as judged by Lunatic Rave 2."
      >
        {stats.expertScore} / {this.props.noteCount * 2}
      </span>
    </span>
  }
}

function formatOffset (n) {
  return (n === 0 ? '' : (n < 0 ? '-' : '+')) + formatDuration(Math.abs(n))
}

function formatDuration (n) {
  return (n * 1000).toFixed(1)
}
