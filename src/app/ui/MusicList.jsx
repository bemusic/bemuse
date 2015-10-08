
import './MusicList.scss'

import React          from 'react'
import MusicListItem  from './MusicListItem.jsx'

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return <ul className="MusicList"
        onTouchStart={this.props.onTouch}>
      {this.props.groups.map(({ title, songs }) => [
        <li className="MusicListのgroupTitle">{title}</li>,
        songs.map(song => <MusicListItem
            key={song.id}
            song={song}
            selected={song.id === this.props.selectedSong.id}
            playMode={this.props.playMode}
            onSelect={this.props.onSelect}
            highlight={this.props.highlight} />),
      ])}
    </ul>
  },
})
