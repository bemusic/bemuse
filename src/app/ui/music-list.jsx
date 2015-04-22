
import './music-list.scss'

import React          from 'react'
import MusicListItem  from './music-list-item.jsx'

export default React.createClass({

  render() {
    return <ul className="music-list">
      {this.props.songs.map(song => <MusicListItem
          key={song.id}
          song={song}
          selected={song.id === this.props.selectedSong.id}
          onSelect={this.props.onSelect} />)}
    </ul>
  },

})
