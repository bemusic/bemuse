
import './music-select-scene.scss'

import React            from 'react'
import c                from 'classnames'
import { Binding }      from 'bemuse/flux'
import Scene            from 'bemuse/ui/scene'
import SceneHeading     from 'bemuse/ui/scene-heading'
import SceneToolbar     from 'bemuse/ui/scene-toolbar'
import ModalPopup       from 'bemuse/ui/modal-popup'
import MusicList        from './music-list'
import MusicInfo        from './music-info'
import Options          from './options'
import CustomBMS        from './custom-bms'
import Store            from '../stores/music-select-store'
import * as Actions     from '../actions/music-select-actions'
import SCENE_MANAGER    from 'bemuse/scene-manager'

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
        : musicSelect.songs.length === 0
        ? <div className="music-select-scene--loading">
            Cannot Load Collection!
          </div>
        : <div className={c('music-select-scene--main',
              { 'is-in-song': this.state.inSong })}>
            <MusicList
                groups={musicSelect.groups}
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
      <SceneToolbar>
        <a onClick={this.popScene} href="javascript://">Exit</a>
        <a onClick={this.handleCustomBMSOpen} href="javascript://">
          Play Custom BMS
        </a>
        <SceneToolbar.Spacer />
        <a onClick={this.handleOptionsOpen} href="javascript://">Options</a>
      </SceneToolbar>
      <ModalPopup
          visible={this.state.optionsVisible}
          onBackdropClick={this.handleOptionsClose}>
        <Options
            onClose={this.handleOptionsClose} />
      </ModalPopup>
      <ModalPopup
          visible={this.state.customBMSVisible}
          onBackdropClick={this.handleCustomBMSClose}>
        <CustomBMS
            onSongLoaded={this.handleCustomSong} />
      </ModalPopup>
    </Scene>
  },

  getInitialState() {
    return {
      musicSelect: Store.get(),
      optionsVisible: shouldShowOptions(),
      customBMSVisible: false,
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
      Actions.launchGame()
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
  handleCustomBMSOpen() {
    this.setState({ customBMSVisible: true })
  },
  handleCustomBMSClose() {
    this.setState({ customBMSVisible: false })
  },
  handleCustomSong(song) {
    Actions.setCustomSong(song)
    this.setState({ customBMSVisible: false })
  },
  popScene() {
    SCENE_MANAGER.pop().done()
  },

})
