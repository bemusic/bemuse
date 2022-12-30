import _ from 'lodash'
import MusicSelectPreviewer from 'bemuse/music-previewer/MusicSelectPreviewer'
import getPlayableCharts from 'bemuse/music-collection/getPlayableCharts'
import getPreviewResourceUrl from 'bemuse/music-collection/getPreviewResourceUrl'
import groupSongsIntoCategories from 'bemuse/music-collection/groupSongsIntoCategories'
import sortSongs from 'bemuse/music-collection/sortSongs'
import React, { useState } from 'react'
import { Song } from 'bemuse/collection-model/types'

type Sorter = (songs: readonly Song[]) => {
  title: string
  songs: Song[]
}[]

const sorters: Record<string, Sorter> = {
  ingame: (songs: readonly Song[]) =>
    groupSongsIntoCategories(sortSongs(songs)),
  added: (songs: readonly Song[]) => [
    {
      title: 'Sorted by added date',
      songs: _.reverse(_.sortBy(songs, getAdded)),
    },
  ],
}

const getAdded = (song: Song) =>
  song.added || (song.initial ? '0000-00-00' : '9999-99-99')

interface Problem {
  keys: readonly string[]
  message: string
}

function validateSong(song: Song): Problem[] {
  const problems: Problem[] = []
  const report = (message: string, ...keys: string[]) =>
    problems.push({ keys, message })
  if (song.unreleased) {
    report('Not released', 'unreleased')
  }
  if (!song.readme) {
    report('No README file found', 'README.md')
  }
  if (!song.replaygain) {
    report('No replay gain', 'replaygain')
  }
  if (!song.artist_url) {
    report('No artist URL', 'artist_url')
  }
  if (!song.added && !song.initial) {
    report('No added date', 'added')
  }
  if (!song.song_url && !song.youtube_url && !song.long_url) {
    report('No song/YouTube/long URL', 'song_url', 'long_url', 'youtube_url')
  }
  if (!song.bms_url && !song.exclusive) {
    report('No download URL', 'bms_url')
  }
  if (!song.bmssearch_id && !song.exclusive) {
    report('No BMS search ID', 'bmssearch_id')
  }
  if (!song.charts.filter((chart) => chart.keys === '5K').length) {
    report('No 5-key charts', '5key')
  }
  for (const chart of getPlayableCharts(song.charts)) {
    if (!chart.info.subtitles.length) {
      report('Missing subtitle', 'chart_names ' + chart.file)
    }
  }
  return problems
}

const SongWarnings = ({ song }: { song: Song }) => {
  const problems = validateSong(song)
  if (!problems.length) return null
  return (
    <div>
      {problems.map((problem, index) => (
        <div key={index}>
          {problem.keys.map((key) => (
            <code
              key={key}
              style={{
                fontFamily: 'Ubuntu Mono',
                marginRight: '2',
                padding: 3,
                fontSize: '0.8em',
                background: '#755',
              }}
            >
              {key}
            </code>
          ))}
          {problem.message}
        </div>
      ))}
    </div>
  )
}
const SongRow = ({
  song,
  url,
  setPreviewUrl,
}: {
  song: Song
  url: string
  setPreviewUrl: (url: string | null) => void
}): JSX.Element => (
  <tr key={song.id}>
    <td>
      <strong
        onClick={() => {
          prompt('', `vim '${song.id}/README.md'`)
        }}
      >
        <code style={{ fontFamily: 'Ubuntu Mono' }}>{song.id}</code>
      </strong>
      <br />
      <span style={{ color: '#8b8685' }}>{song.added}</span>
    </td>
    <td style={{ textAlign: 'center', background: '#353433' }}>
      <span
        style={{ color: '#8b8685' }}
        onClick={async () => {
          const previewUrl = await getPreviewResourceUrl(song, url)
          setPreviewUrl(previewUrl)
        }}
      >
        {song.genre}
      </span>
      <br />
      <strong
        onClick={() => {
          console.log(song)
          alert(require('util').inspect(song))
        }}
      >
        {song.title}
      </strong>
      <br />
      {song.artist}
    </td>
    <td>
      <SongWarnings song={song} />
    </td>
  </tr>
)

const Rows = ({
  sort,
  songs,
  url,
  setPreviewUrl,
}: {
  sort: string
  songs: readonly Song[]
  url: string
  setPreviewUrl: (url: string | null) => void
}) => {
  const categories = sorters[sort](songs)
  const out: JSX.Element[] = []
  for (const category of categories) {
    out.push(
      <tr key={category.title}>
        <th colSpan={4}>{category.title}</th>
      </tr>
    )
    for (const song of category.songs) {
      out.push(<SongRow {...{ song, url, setPreviewUrl }} />)
    }
  }
  return <>{out}</>
}

const Preview = ({
  previewUrl,
  previewEnabled,
  togglePreview,
}: {
  previewUrl: string | null
  previewEnabled: boolean
  togglePreview: () => void
}) => {
  const button = (
    <button onClick={togglePreview}>
      {previewEnabled ? 'disable' : 'enable'}
    </button>
  )
  return (
    <span>
      <strong>Music preview:</strong> {button}
      {previewEnabled && previewUrl && (
        <MusicSelectPreviewer url={previewUrl} />
      )}
    </span>
  )
}

const Sorter = ({ setSort }: { setSort: (key: string) => void }) => {
  const out = []
  for (const key of Object.keys(sorters)) {
    out.push(
      <button key={key} onClick={() => setSort(key)}>
        {key}
      </button>
    )
  }
  return (
    <span>
      <strong>Sort by:</strong> {out}
    </span>
  )
}

const Table = ({
  data,
  url,
  initialSort,
}: {
  data: { songs: readonly Song[] }
  url: string
  initialSort: string
}) => {
  const [sort, setSort] = useState(initialSort || Object.keys(sorters)[0])
  const [previewEnabled, setPreviewEnabled] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  return (
    <table style={{ borderSpacing: 4 }}>
      <thead>
        <tr>
          <th colSpan={4}>
            <Sorter setSort={setSort} />
            {' · '}
            <Preview
              previewEnabled={previewEnabled}
              previewUrl={previewUrl}
              togglePreview={() => setPreviewEnabled((flag) => !flag)}
            />
          </th>
        </tr>
        <tr>
          <th>id</th>
          <th>song</th>
          <th>warnings</th>
        </tr>
      </thead>
      <tbody>
        <Rows
          sort={sort}
          songs={data.songs}
          url={url}
          setPreviewUrl={setPreviewUrl}
        />
      </tbody>
    </table>
  )
}

const Message = ({ text }: { text: string }) => (
  <div style={{ textAlign: 'center' }}>{text}</div>
)

export interface MusicTableProps {
  data: { songs: readonly Song[] } | null
  url: string
  initialSort: string
}

export const MusicTable = ({ data, url, initialSort }: MusicTableProps) => {
  if (!data) return <Message text='No data' />
  try {
    return <Table data={data} url={url} initialSort={initialSort} />
  } catch (e) {
    return <Message text={`Error: ${e}`} />
  }
}

export default MusicTable
