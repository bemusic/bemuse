import './LoadingSceneSongInfo.scss'

import React from 'react'
import { isTitleDisplayMode } from 'bemuse/devtools/query-flags'

export interface LoadingSceneSongInfoProps {
  song: {
    title: string
    artist: string
    genre: string
    subtitles: readonly string[]
    subartists: readonly string[]
    difficulty: number
    level: number
  }
}

const LoadingSceneSongInfo = ({ song }: LoadingSceneSongInfoProps) => (
  <div className='LoadingSceneSongInfo'>
    <div className='LoadingSceneSongInfoのgenre'>{song.genre}</div>
    <div className='LoadingSceneSongInfoのtitle'>{song.title}</div>
    {!isTitleDisplayMode()
      ? song.subtitles.map((text) => (
          <div key={text} className='LoadingSceneSongInfoのsubtitle'>
            {text}
          </div>
        ))
      : null}
    <div className='LoadingSceneSongInfoのartist'>{song.artist}</div>
    {song.subartists.map((text) => (
      <div key={text} className='LoadingSceneSongInfoのsubartist'>
        {text}
      </div>
    ))}
  </div>
)
export default LoadingSceneSongInfo
