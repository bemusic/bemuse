import './MusicInfoTabStats.scss'

import Icon from 'react-fa'
import React from 'react'
import PropTypes from 'prop-types'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

import formatTime from '../../utils/formatTime'
import withPersonalRecord from './withPersonalRecord'

export const MusicInfoTabStats = React.createClass({
  propTypes: {
    chart: PropTypes.object,
    record: PropTypes.object,
    user: PropTypes.object,
    loading: PropTypes.bool
  },

  render () {
    const chart = this.props.chart
    const record = this.props.record
    return <div className="MusicInfoTabStats">
      {this.renderMessage()}
      <dl className="MusicInfoTabStatsのcolumn is-left">
        <dt>Notes</dt>
        <dd>{chart.noteCount}</dd>
        <dt>BPM</dt>
        <dd>{chart.bpm.median}</dd>
        <dt>Duration</dt>
        <dd>{formatTime(chart.duration)}</dd>
        <dt>Play Count</dt>
        <dd>{this.renderWhenNotLoading(() =>
          record ? record.playCount : (this.props.user ? '0' : '-')
        )}</dd>
      </dl>
      <dl className="MusicInfoTabStatsのcolumn is-right">
        <dt>Best Score</dt>
        <dd>{this.renderWhenNotLoading(() => record ? record.score : '-')}</dd>

        <dt>Accuracy</dt>
        <dd>{this.renderWhenNotLoading(() => record
          ? formattedAccuracyForRecord(record)
          : '-'
        )}</dd>

        <dt>Max Combo</dt>
        <dd>{this.renderWhenNotLoading(() => record
          ? <span>{record.combo} <small>/ {record.total}</small></span>
          : '-'
        )}</dd>
      </dl>
    </div>
  },

  renderWhenNotLoading (f) {
    return (this.props.loading
      ? <Icon name="spinner" spin />
      : f()
    )
  },

  renderMessage () {
    if (!this.props.user) {
      return (
        <div className="MusicInfoTabStatsのmessage">
          Please log in or create an account to save your play statistics.
        </div>
      )
    }
    return null
  }
})

export default withPersonalRecord(MusicInfoTabStats)
