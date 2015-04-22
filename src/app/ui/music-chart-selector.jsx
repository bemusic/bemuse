
import './music-chart-selector.scss'

import React from 'react'
import MusicChartSelectorItem from './music-chart-selector-item.jsx'

export default React.createClass({

  render() {
    return <ul className="music-chart-selector">
      {this.props.charts.map(chart =>
        <MusicChartSelectorItem
            chart={chart}
            isTutorial={this.props.song.tutorial}
            isSelected={chart.md5 === this.props.selectedChart.md5}
            onChartClick={this.props.onChartClick} />)}
    </ul>
  }

})
