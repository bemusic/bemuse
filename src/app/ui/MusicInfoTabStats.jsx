
import './MusicInfoTabStats.scss'

import React  from 'react'

export default React.createClass({

  render () {
    const chart = this.props.chart
    return <div className="MusicInfoTabStats">
      <dl className="MusicInfoTabStatsのcolumn is-left">
        <dt>Notes</dt>
        <dd>{chart.noteCount}</dd>
        <dt>BPM</dt>
        <dd>{chart.bpm.median}</dd>
      </dl>
      <dl className="MusicInfoTabStatsのcolumn is-right">
        <dt>Best Score</dt>
        <dd>-</dd>
        <dt>Max Combo</dt>
        <dd>-</dd>
      </dl>
    </div>
  },

})
