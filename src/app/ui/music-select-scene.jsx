
import './music-select-scene.scss'

import React            from 'react'
import { Binding }      from 'bemuse/flux'
import Scene            from 'bemuse/ui/scene.jsx'
import SceneHeading     from 'bemuse/ui/scene-heading.jsx'
import MusicList        from './music-list.jsx'
import MusicInfo        from './music-info.jsx'
import Store            from '../stores/music-select-store'
import * as Actions     from '../actions/music-select-actions'

export default React.createClass({

  render() {
    return <Scene className="music-select-scene">
      <Binding store={Store} onChange={this.handleState} />
      <SceneHeading>
        Select Music
        <input
            type="text"
            placeholder="Filter…"
            className="music-select-scene--search"
            onChange={this.handleFilter}
            value={this.state.filterText} />
      </SceneHeading>
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
                charts={this.state.charts}
                onChartClick={this.handleChartClick} />
          </div>
      }
    </Scene>
  },

  getInitialState() {
    return Store.get()
  },
  handleState(state) {
    this.setState(state)
  },
  handleSongSelect(song) {
    Actions.selectSong(song)
  },
  handleChartClick(chart) {
    if (this.state.chart.md5 === chart.md5) {
      Actions.launchGame()
    } else {
      Actions.selectChart(chart)
    }
  },
  handleFilter(e) {
    Actions.setFilterText(e.target.value)
  }

})
