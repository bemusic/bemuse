
import './LoadingSceneSongInfo.scss'

import React from 'react'

export default React.createClass({

  render() {
    const song = this.props.song
    return <div className="LoadingSceneSongInfo">
      <div className="LoadingSceneSongInfoのgenre">{song.genre}</div>
      <div className="LoadingSceneSongInfoのtitle">{song.title}</div>
      {song.subtitles.map(text =>
        <div className="LoadingSceneSongInfoのsubtitle">{text}</div>)}
      <div className="LoadingSceneSongInfoのartist">{song.artist}</div>
      {song.subartists.map(text =>
        <div className="LoadingSceneSongInfoのsubartist">{text}</div>)}
    </div>
  }

})
