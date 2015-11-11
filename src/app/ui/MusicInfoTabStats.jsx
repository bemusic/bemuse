
import './MusicInfoTabStats.scss'

import React            from 'react'

import withPersonalRecord             from './withPersonalRecord'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

export const MusicInfoTabStats = React.createClass({

  render () {
    const chart = this.props.chart
    const record = this.props.record
    return <div className="MusicInfoTabStats">
      <dl className="MusicInfoTabStatsのcolumn is-left">
        <dt>Notes</dt>
        <dd>{chart.noteCount}</dd>
        <dt>BPM</dt>
        <dd>{chart.bpm.median}</dd>
      </dl>
      <dl className="MusicInfoTabStatsのcolumn is-right">
        <dt>Best Score</dt>
        <dd>{record ? record.score : '-'}</dd>

        <dt>Accuracy</dt>
        <dd>{record
          ? formattedAccuracyForRecord(record)
          : '-'
        }</dd>

        <dt>Max Combo</dt>
        <dd>{record
          ? <span>{record.combo} <small>/ {record.total}</small></span>
          : '-'
        }</dd>
      </dl>
    </div>
  },

})

export default withPersonalRecord(MusicInfoTabStats)
