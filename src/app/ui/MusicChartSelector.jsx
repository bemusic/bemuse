
import './MusicChartSelector.scss'

import React from 'react'
import MusicChartSelectorItem from './MusicChartSelectorItem.jsx'

class MusicChartSelector extends React.Component {
  render () {
    return <ul className="MusicChartSelector">
      {this.props.charts.map((chart, index) =>
        <MusicChartSelectorItem
          key={index}
          chart={chart}
          isTutorial={this.props.song.tutorial}
          isSelected={chart.md5 === this.props.selectedChart.md5}
          onChartClick={this.props.onChartClick} />)}
    </ul>
  }
}

export default MusicChartSelector
