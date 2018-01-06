import './MusicInfo.scss'

import React from 'react'
import PropTypes from 'prop-types'
import MusicChartInfo from './MusicChartInfo.jsx'
import MusicChartSelector from './MusicChartSelector.jsx'
import MusicInfoTabs from './MusicInfoTabs.jsx'

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

class MusicInfo extends React.PureComponent {
  static propTypes = {
    chart: chartPropType,
    charts: PropTypes.arrayOf(chartPropType),
    onChartClick: PropTypes.func,
    onOptions: PropTypes.func,
    playMode: PropTypes.string,
    song: PropTypes.object
  }

  render () {
    const { song, chart } = this.props
    return (
      <section className='MusicInfo'>
        <MusicChartInfo info={chart.info} />
        <MusicChartSelector
          song={song}
          selectedChart={chart}
          charts={this.props.charts}
          onChartClick={this.props.onChartClick}
        />
        <MusicInfoTabs
          song={song}
          chart={chart}
          playMode={this.props.playMode}
          onOptions={this.props.onOptions}
        />
      </section>
    )
  }
}

export default MusicInfo
