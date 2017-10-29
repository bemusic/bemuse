
import './MusicList.scss'

import React          from 'react'
import _              from 'lodash'
import MusicListItem  from './MusicListItem.jsx'

class MusicList extends React.PureComponent {
  render () {
    return <ul className="MusicList js-scrollable-view"
      onTouchStart={this.props.onTouch}>
      {this.props.groups.map(({ title, songs }) => [
        <li key={title} className="MusicListのgroupTitle">{title}</li>,
        songs.map(song => <MusicListItem
          key={song.id}
          song={song}
          selected={song.id === this.props.selectedSong.id}
          selectedChart={this.getSelectedChart(song)}
          playMode={this.props.playMode}
          onSelect={this.props.onSelect}
          highlight={this.props.highlight} />),
      ])}
    </ul>
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
