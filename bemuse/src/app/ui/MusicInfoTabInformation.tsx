import './MusicInfoTabInformation.scss'

import Markdown from 'bemuse/ui/Markdown'
import YouTube from 'bemuse/ui/YouTube'
import React, { memo } from 'react'
import type { Song } from 'bemuse/collection-model/types'

import { useReadme } from '../io/ReadmeIO'

export interface MusicInfoTabInformationProps {
  song: Song
}

const Buttons = ({ song }: MusicInfoTabInformationProps) => {
  const buttons = []
  if (song.bms_url) {
    buttons.push(<Link text='Download BMS' url={song.bms_url} />)
  }
  if (song.song_url) {
    const text = /soundcloud\.com/.test(song.song_url)
      ? 'SoundCloud'
      : 'Song URL'
    buttons.push(<Link text={text} url={song.song_url} />)
  }
  if (song.long_url) {
    buttons.push(<Link text='Long Version' url={song.long_url} />)
  }
  if (song.bmssearch_id) {
    buttons.push(
      <Link
        text='BMS Search'
        url={
          typeof song.bmssearch_id === 'number' ||
          String(song.bmssearch_id).match(/^\d{1,6}$/)
            ? `http://bmssearch.net/bms?id=${song.bmssearch_id}`
            : `https://bmssearch.net/bmses/${song.bmssearch_id}`
        }
      />
    )
  }
  if (buttons.length === 0) {
    return null
  } else {
    return <p className='MusicInfoTabInformationのbuttons'>{buttons}</p>
  }
}

const Link = ({ text, url }: { text: string; url?: string }) =>
  url ? (
    <a key={text} href={url} target='_blank' rel='noreferrer'>
      {text}
    </a>
  ) : (
    <>{text}</>
  )

const MusicInfoTabInformation = ({ song }: MusicInfoTabInformationProps) => {
  const readme = useReadme(song)

  return (
    <div className='MusicInfoTabInformation'>
      <Buttons song={song} />
      <p className='MusicInfoTabInformationのartist'>
        <span>Artist:</span>
        <strong>
          <Link text={song.artist} url={song.artist_url} />
        </strong>
      </p>
      {song.youtube_url ? <YouTube url={song.youtube_url} /> : null}
      <section className='MusicInfoTabInformationのreadme'>
        <Markdown source={readme} />
      </section>
    </div>
  )
}

export default memo(MusicInfoTabInformation)
