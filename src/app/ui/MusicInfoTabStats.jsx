
import './MusicInfoTabStats.scss'

import React from 'react'
import Icon  from 'react-fa'

import withPersonalRecord             from './withPersonalRecord'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

export const MusicInfoTabStats = React.createClass({

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
      ? <Icon name='spinner' spin />
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
