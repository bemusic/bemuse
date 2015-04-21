
import './music-select-scene.scss'

import React            from 'react'
import Scene            from 'bemuse/ui/scene.jsx'
import SceneHeading     from 'bemuse/ui/scene-heading.jsx'
import MusicList        from './music-list.jsx'
import MusicInfo        from './music-info.jsx'
import * as MusicSelect from '../stores/music-select'

export default React.createClass({

  render() {
    return <Scene className="music-select-scene">
      <SceneHeading>Select Music</SceneHeading>
      {
        this.state.loading
        ? <div className="music-select-scene--loading">Loading…</div>
        : <div>
            <MusicList
                songs={this.state.songs}
                selectedSong={this.state.song}
                onSelect={this.handleSongSelect} />
            <MusicInfo
                song={this.state.song}
                chart={this.state.chart}
                onChartClick={this.handleChartClick} />
          </div>
      }
    </Scene>
  },

  getInitialState() {
    return MusicSelect.state.get()
  },
  componentDidMount() {
    this._unsubscribe = MusicSelect.state.watch(this.setState.bind(this))
  },
  componentDidUnmount() {
    this._unsubscribe()
  },

  handleSongSelect(song) {
    MusicSelect.selectSong(song)
  },
  handleChartClick(chart) {
    if (this.state.chart.md5 === chart.md5) {
      MusicSelect.launchGame()
    } else {
      MusicSelect.selectChart(chart)
    }
  },

})
