
import './loading-scene-song-info.scss'

import React from 'react'

export default React.createClass({

  render() {
    const song = this.props.song
    return <div className="loading-scene-song-info">
      <div className="loading-scene-song-info--genre">{song.genre}</div>
      <div className="loading-scene-song-info--title">{song.title}</div>
      {song.subtitles.map(text =>
        <div className="loading-scene-song-info--subtitle">{text}</div>)}
      <div className="loading-scene-song-info--artist">{song.artist}</div>
      {song.subartists.map(text =>
        <div className="loading-scene-song-info--subartist">{text}</div>)}
    </div>
  }

})
