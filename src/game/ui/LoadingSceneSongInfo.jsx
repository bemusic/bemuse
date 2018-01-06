import './LoadingSceneSongInfo.scss'

import React from 'react'
import PropTypes from 'prop-types'
import { isTitleDisplayMode } from 'bemuse/devtools/query-flags'

export default class LoadingSceneSongInfo extends React.Component {
  static propTypes = {
    song: PropTypes.shape({
      title: PropTypes.string,
      artist: PropTypes.string,
      genre: PropTypes.string,
      subtitles: PropTypes.arrayOf(PropTypes.string),
      subartists: PropTypes.arrayOf(PropTypes.string),
      difficulty: PropTypes.number,
      level: PropTypes.number
    }).isRequired
  }

  render () {
    const song = this.props.song
    return (
      <div className='LoadingSceneSongInfo'>
        <div className='LoadingSceneSongInfoのgenre'>{song.genre}</div>
        <div className='LoadingSceneSongInfoのtitle'>{song.title}</div>
        {!isTitleDisplayMode()
          ? song.subtitles.map(text => (
            <div key={text} className='LoadingSceneSongInfoのsubtitle'>
              {text}
            </div>
          ))
          : null}
        <div className='LoadingSceneSongInfoのartist'>{song.artist}</div>
        {song.subartists.map(text => (
          <div key={text} className='LoadingSceneSongInfoのsubartist'>
            {text}
          </div>
        ))}
      </div>
    )
  }
}
