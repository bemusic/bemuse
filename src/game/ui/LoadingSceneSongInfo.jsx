
import './LoadingSceneSongInfo.scss'

import React from 'react'
import { isTitleDisplayMode } from 'bemuse/devtools/query-flags'

export default class LoadingSceneSongInfo extends React.Component {
  render() {
    const song = this.props.song
    return <div className="LoadingSceneSongInfo">
      <div className="LoadingSceneSongInfoのgenre">{song.genre}</div>
      <div className="LoadingSceneSongInfoのtitle">{song.title}</div>
      {!isTitleDisplayMode()
        ? song.subtitles.map(text =>
          <div className="LoadingSceneSongInfoのsubtitle">{text}</div>
        )
        : null
      }
      <div className="LoadingSceneSongInfoのartist">{song.artist}</div>
      {song.subartists.map(text =>
        <div className="LoadingSceneSongInfoのsubartist">{text}</div>)}
    </div>
  }
}
