import './MusicInfo.scss'

import React from 'react'
import MusicChartInfo from './MusicChartInfo.jsx'
import MusicChartSelector from './MusicChartSelector.jsx'
import MusicInfoTabs from './MusicInfoTabs.jsx'

class MusicInfo extends React.PureComponent {
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
