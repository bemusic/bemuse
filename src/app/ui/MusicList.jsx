import './MusicList.scss'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import MusicListItem from './MusicListItem.jsx'

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

const songPropType = PropTypes.shape({
  artist: PropTypes.string,
  bpm: PropTypes.number,
  charts: PropTypes.arrayOf(chartPropType),
  custom: PropTypes.bool,
  genre: PropTypes.string,
  id: PropTypes.string,
  resources: PropTypes.any,
  title: PropTypes.string,
  warning: PropTypes.array
})

class MusicList extends React.PureComponent {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      songs: PropTypes.arrayOf(songPropType)
    })),
    onTouch: PropTypes.func,
    onSelect: PropTypes.func,
    selectedSong: PropTypes.object,
    selectedChart: chartPropType,
    playMode: PropTypes.string,
    highlight: PropTypes.string
  }

  render () {
    return (
      <ul
        className='MusicList js-scrollable-view'
        onTouchStart={this.props.onTouch}
      >
        {this.props.groups.map(({ title, songs }) => [
          <li key={title} className='MusicListのgroupTitle'>
            {title}
          </li>,
          songs.map(song => (
            <MusicListItem
              key={song.id}
              song={song}
              selected={song.id === this.props.selectedSong.id}
              selectedChart={this.getSelectedChart(song)}
              playMode={this.props.playMode}
              onSelect={this.props.onSelect}
              highlight={this.props.highlight}
            />
          ))
        ])}
      </ul>
    )
  }

  getSelectedChart (song) {
    // Performance issue:
    //
    // We cannot just send `this.props.selectedChart` into every MusicListItem,
    // because this will break PureRenderMixin thus causing every MusicListItem
    // to be re-rendered.
    //
    // If the song being rendered does not contain the selected chart, don’t
    // bother sending it in (just keep it as undefined).
    //
    let selectedChart = this.props.selectedChart
    return _.find(song.charts, chart => chart === selectedChart)
  }
}

export default MusicList
