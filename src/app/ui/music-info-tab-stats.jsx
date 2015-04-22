
import './music-info-tab-stats.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render() {
    const song  = this.props.song
    const chart = this.props.chart
    return <div className="music-info-tab-stats">
      <dl className="music-info-tab-stats--column is-left">
        <dt>Notes</dt>
        <dd>{chart.noteCount}</dd>
        <dt>BPM</dt>
        <dd>{chart.bpm.median}</dd>
      </dl>
      <dl className="music-info-tab-stats--column is-right">
        <dt>Best Score</dt>
        <dd>-</dd>
        <dt>Max Combo</dt>
        <dd>-</dd>
      </dl>
    </div>
  },

})
