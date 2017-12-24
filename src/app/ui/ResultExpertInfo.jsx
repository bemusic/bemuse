import PropTypes from 'prop-types'
import React from 'react'
import mean from 'mean'
import variance from 'variance'
import { createSelector, createStructuredSelector } from 'reselect'

import getNonMissedDeltas from '../interactors/getNonMissedDeltas'

// Disabling this rule because we are using reselect to compute data from props.
/* eslint react/no-unused-prop-types: off */

export default class ResultExpertInfo extends React.Component {
  static propTypes = {
    deltas: PropTypes.array
  }
  getStats = (() => {
    const selectNonMissedDeltas = createSelector(
      props => props.deltas,
      deltas => getNonMissedDeltas(deltas)
    )
    const selectMean = createSelector(selectNonMissedDeltas, deltas =>
      mean(deltas)
    )
    const selectStandardDeviation = createSelector(
      selectNonMissedDeltas,
      deltas => Math.sqrt(variance(deltas))
    )
    const selectStats = createStructuredSelector({
      mean: selectMean,
      standardDeviation: selectStandardDeviation
    })
    return () => selectStats(this.props)
  })()
  render () {
    const stats = this.getStats()
    return (
      <span>
        <span
          style={{ cursor: 'help' }}
          title='Average and standard deviation of your keypresses.'
        >
          {formatOffset(stats.mean)} ± {formatDuration(stats.standardDeviation)}ms
        </span>
      </span>
    )
  }
}

function formatOffset (n) {
  return (n === 0 ? '' : n < 0 ? '-' : '+') + formatDuration(Math.abs(n))
}

function formatDuration (n) {
  return (n * 1000).toFixed(1)
}
