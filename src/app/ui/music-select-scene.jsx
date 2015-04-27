
import './music-select-scene.scss'

import React            from 'react'
import c                from 'classnames'
import { Binding }      from 'bemuse/flux'
import Scene            from 'bemuse/ui/scene'
import SceneHeading     from 'bemuse/ui/scene-heading'
import ModalPopup       from 'bemuse/ui/modal-popup'
import MusicList        from './music-list'
import MusicInfo        from './music-info'
import Options          from './options'
import Store            from '../stores/music-select-store'
import * as Actions     from '../actions/music-select-actions'

import { shouldShowOptions } from 'bemuse/devtools/query-flags'

React.initializeTouchEvents(true)

export default React.createClass({

  render() {
    let musicSelect = this.state.musicSelect
    return <Scene className="music-select-scene">
      <Binding store={Store} onChange={this.handleState} />
      <SceneHeading>
        Select Music
        <input
            type="text"
            placeholder="Filter…"
            className="music-select-scene--search"
            onChange={this.handleFilter}
            value={musicSelect.filterText} />
      </SceneHeading>
      {
        musicSelect.loading
        ? <div className="music-select-scene--loading">Loading…</div>
        : <div className={c('music-select-scene--main',
              { 'is-in-song': this.state.inSong })}>
            <MusicList
                songs={musicSelect.songs}
                highlight={musicSelect.filterText}
                selectedSong={musicSelect.song}
                onSelect={this.handleSongSelect}
                onTouch={this.handleMusicListTouch} />
            <MusicInfo
                song={musicSelect.song}
                chart={musicSelect.chart}
                charts={musicSelect.charts}
                onChartClick={this.handleChartClick}
                onOptions={this.handleOptionsOpen} />
          </div>
      }
      <ModalPopup
          visible={this.state.optionsVisible}
          onBackdropClick={this.handleOptionsClose}>
        <Options
            onClose={this.handleOptionsClose} />
      </ModalPopup>
    </Scene>
  },

  getInitialState() {
    return {
      musicSelect: Store.get(),
      optionsVisible: shouldShowOptions(),
      inSong: false,
    }
  },
  handleState(state) {
    this.setState({ musicSelect: state })
  },
  handleSongSelect(song) {
    Actions.selectSong(song)
    this.setState({ inSong: true })
  },
  handleMusicListTouch() {
    this.setState({ inSong: false })
  },
  handleChartClick(chart) {
    if (this.state.musicSelect.chart.md5 === chart.md5) {
      Actions.launchGame({ scene: this.props.scene })
    } else {
      Actions.selectChart(chart)
    }
  },
  handleFilter(e) {
    Actions.setFilterText(e.target.value)
  },
  handleOptionsOpen() {
    this.setState({ optionsVisible: true })
  },
  handleOptionsClose() {
    this.setState({ optionsVisible: false })
  },

})
