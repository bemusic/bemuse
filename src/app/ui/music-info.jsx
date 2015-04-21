
import './music-info.scss'

import React from 'react'
import MusicChartInfo     from './music-chart-info.jsx'
import MusicChartSelector from './music-chart-selector.jsx'

export default React.createClass({

  render() {
    const song  = this.props.song
    const chart = this.props.chart
    return <section className="music-info">
      <MusicChartInfo chart={chart} />
      <MusicChartSelector
          charts={song.charts}
          selectedChart={chart}
          onChartClick={this.props.onChartClick} />
      {chart.file}
    </section>
  }

})
