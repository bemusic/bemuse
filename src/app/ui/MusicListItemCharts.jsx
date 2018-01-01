import './MusicListItemCharts.scss'
import React from 'react'
import PropTypes from 'prop-types'

import MusicListItemChartContainer from './MusicListItemChartContainer'

const chartPropType = PropTypes.shape({
  bpm: PropTypes.shape({
    init: PropTypes.number,
    max: PropTypes.number,
    median: PropTypes.number,
    min: PropTypes.number
  }),
  duration: PropTypes.number,
  file: PropTypes.string,
  info: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    genre: PropTypes.string,
    subtitles: PropTypes.arrayOf(PropTypes.string),
    subartists: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.number,
    level: PropTypes.number
  }),
  keys: PropTypes.string,
  md5: PropTypes.string,
  noteCount: PropTypes.number
})

export default class MusicListItemCharts extends React.Component {
  static propTypes = {
    charts: PropTypes.arrayOf(chartPropType),
    onChartClick: PropTypes.func,
    selectedChart: chartPropType,
    playMode: PropTypes.string
  }

  render () {
    return (
      <div className='MusicListItemCharts'>
        {this.props.charts.map((chart, index) => (
          <MusicListItemChartContainer
            key={index}
            chart={chart}
            selected={
              this.props.selectedChart &&
              chart.md5 === this.props.selectedChart.md5
            }
            onClick={this.props.onChartClick}
            playMode={this.props.playMode}
          />
        ))}
      </div>
    )
  }
}
