/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react'

import { Container } from '../components/container'
import Layout from '@theme/Layout'
import { MusicServerData } from '../lib/music'
import styles from './music.module.css'

interface SongInfo {
  title: string
  song_url?: string
  long_url?: string
  bms_url?: string
}

interface ArtistInfo {
  name: string
  sortKey: string
  url: string
  songs: SongInfo[]
}

const songUrl = (song: SongInfo): string | undefined =>
  song.song_url || song.long_url || song.bms_url

const Song = ({ song }: { song: SongInfo }) => {
  const url = songUrl(song)
  if (url) {
    return <a href={url}>{song.title}</a>
  }
  return <span>{song.title}</span>
}

const Artist = ({ artist: { name, songs, url } }: { artist: ArtistInfo }) => (
  <>
    <a href={url}>
      <strong>{name}</strong>
    </a>
    <ul>
      {songs.map((song) => (
        <li key={song.title}>
          <Song song={song} />
        </li>
      ))}
    </ul>
  </>
)

const Artists = ({ artists }: { artists: ArtistInfo[] }) => (
  <ul className={styles.artists_list}>
    {artists.map((artist) => (
      <li key={artist.name}>
        <Artist artist={artist} />
      </li>
    ))}
  </ul>
)

type LoadState =
  | {
      type: 'loading'
    }
  | { type: 'error'; error: string }
  | { type: 'loaded'; songs: MusicServerData['songs'] }

const artistAliases: Record<string, string | undefined> = {
  'BEMUSE SOUND TEAM': 'flicknote',
  'flicknote vs Dekdekbaloo feat. MindaRyn': 'flicknote',
  Larimar: 'Dachs',
  'Ｎｅｇｏ＿ｔｉａｔｏｒ/映像：Fiz': 'Nego_tiator',
  'Ym1024 feat. lamie*': 'Ym1024',
}
const artistSortKeys: Record<string, string | undefined> = {
  ああああ: 'aaaa',
  すてらべえ: 'stellabee',
  葵: 'aoi',
}

const computeArtistInfos = (songs?: MusicServerData['songs']): ArtistInfo[] => {
  if (!songs) return []

  const result: ArtistInfo[] = []
  const map = new Map<string, ArtistInfo>()
  for (const song of songs) {
    const artistName =
      song.alias_of || artistAliases[song.artist] || song.artist
    if (!map.has(artistName)) {
      const info: ArtistInfo = {
        name: artistName,
        sortKey: (artistSortKeys[artistName] || artistName).toLowerCase(),
        url: song.artist_url,
        songs: [],
      }
      map.set(artistName, info)
      result.push(info)
    }
    map.get(artistName)?.songs.push(song)
  }
  return result.sort((a, b) => {
    return a.sortKey < b.sortKey ? -1 : 1
  })
}

const Content = () => {
  const [state, setState] = useState<LoadState>({ type: 'loading' })
  useEffect(
    () =>
      void (async () => {
        const res = await fetch('https://music4.bemuse.ninja/server/index.json')
        if (!res.ok) {
          setState({
            type: 'error',
            error: `Fetching music list failed with HTTP status ${res.status}`,
          })
          return
        }
        const data: MusicServerData = await res.json()
        setState({ type: 'loaded', songs: data.songs })
      })(),
    []
  )

  return (
    <div className={styles.content}>
      {state.type === 'loading' ? (
        <div className={styles.message}>'(Loading song list...)'</div>
      ) : state.type === 'error' ? (
        <div className={styles.message}>`(Error: ${state.error})`</div>
      ) : (
        <Artists artists={computeArtistInfos(state.songs)} />
      )}
    </div>
  )
}

const Music = () => (
  <div className='docMainWrapper wrapper'>
    <Container className='mainContainer documentContainer postContainer'>
      <div className='post'>
        <header className='postHeader'>
          <h1 className='postHeaderTitle'>Artists Showcase</h1>
          <p>
            We'd like to thank the following artists for letting us use their
            songs in the game.
          </p>
        </header>
      </div>
      <Content />
    </Container>
  </div>
)

export default () => (
  <Layout>
    <Music />
  </Layout>
)
