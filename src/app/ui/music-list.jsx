
import './music-list.scss'

import React          from 'react'
import MusicListItem  from './music-list-item.jsx'

export default React.createClass({

  render() {
    return <ul className="music-list">
      {this.props.songs.map(song => <MusicListItem
          key={song.dir}
          song={song}
          selected={song.dir === this.props.selectedSong.dir}
          onSelect={this.props.onSelect} />)}
    </ul>
  },

})
