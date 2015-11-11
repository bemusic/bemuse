
import './MusicInfoTabStats.scss'

import React            from 'react'
import { connect }      from 'bemuse/flux'
import * as DataStore   from 'bemuse/online/data-store'
import online           from 'bemuse/online/instance'
import id               from 'bemuse/online/id'
import MusicSelectStore from '../stores/music-select-store'

import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

export const MusicInfoTabStats = React.createClass({

  componentDidMount () {
    online.seen(this.getDescriptor())
  },

  render () {
    const chart = this.props.chart
    const record = this.getRecord(this.props.onlineRecords)
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

  // TODO: extract to withRecord HOC
  getRecord (data) {
    return DataStore.get(data, id(this.getDescriptor())).value
  },

  getDescriptor () {
    return { md5: this.props.chart.md5, playMode: this.props.playMode }
  },

})

export default connect(
  {
    onlineRecords: online.records川,
    playMode:      MusicSelectStore.map(state => state.playMode),
  },
  MusicInfoTabStats
)
