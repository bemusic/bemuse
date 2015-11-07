
import './MusicListItemCharts.scss'
import React from 'react'

import MusicListItemChartContainer from './MusicListItemChartContainer'

export default React.createClass({
  render () {
    return <div className="MusicListItemCharts">
      {this.props.charts.map((chart, index) =>
        <MusicListItemChartContainer
          key={index}
          chart={chart}
          selected={this.props.selectedChart && chart.md5 === this.props.selectedChart.md5}
          onClick={this.props.onChartClick}
          playMode={this.props.playMode} />
      )}
    </div>
  },
})
