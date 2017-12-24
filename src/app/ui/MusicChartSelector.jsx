
import './MusicChartSelector.scss'

import React from 'react'
import PropTypes from 'prop-types'
import MusicChartSelectorItem from './MusicChartSelectorItem.jsx'

class MusicChartSelector extends React.Component {
  static propTypes = {
    charts: PropTypes.array,
    song: PropTypes.object,
    selectedChart: PropTypes.object,
    onChartClick: PropTypes.func
  }

  render () {
    return <ul className='MusicChartSelector'>
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
