
import './MusicListItemCharts.scss'
import React from 'react'

import MusicListItemChartContainer from './MusicListItemChartContainer'

export default React.createClass({
  render() {
    return <div className="MusicListItemCharts">
      {this.props.charts.map(chart =>
        <MusicListItemChartContainer chart={chart} key={chart.md5} playMode={this.props.playMode} />
      )}
    </div>
  },
})
