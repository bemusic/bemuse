import _ from 'lodash'
import MusicSelectPreviewer from 'bemuse/music-previewer/MusicSelectPreviewer'
import React from 'react'
import PropTypes from 'prop-types'
import getPlayableCharts from 'bemuse/music-collection/getPlayableCharts'
import getPreviewUrl from 'bemuse/music-collection/getPreviewUrl'
import groupSongsIntoCategories from 'bemuse/music-collection/groupSongsIntoCategories'
import sortSongs from 'bemuse/music-collection/sortSongs'

const sorters = {
  ingame: songs => groupSongsIntoCategories(sortSongs(songs)),
  added: songs => [
    {
      title: 'Sorted by added date',
      songs: _.reverse(_.sortBy(songs, getAdded))
    }
  ]
}

const getAdded = song =>
  song.added || (song.initial ? '0000-00-00' : '9999-99-99')

function validateSong (song) {
  const problems = []
  const report = (message, ...keys) => problems.push({ keys, message })
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
  if (!song.charts.filter(chart => chart.keys === '5K').length) {
    report('No 5-key charts', '5key')
  }
  for (const chart of getPlayableCharts(song.charts)) {
    if (!chart.info.subtitles.length) {
      report('Missing subtitle', 'chart_names ' + chart.file)
    }
  }
  return problems
}

function renderSongWarnings (song) {
  const problems = validateSong(song)
  if (!problems.length) return null
  return (
    <div>
      {problems.map((problem, index) => (
        <div key={index}>
          {problem.keys.map(key => (
            <code
              key={key}
              style={{
                fontFamily: 'Ubuntu Mono',
                marginRight: '2',
                padding: 3,
                fontSize: '0.8em',
                background: '#755'
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

export class MusicTable extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    url: PropTypes.string,
    initialSort: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      sort: this.props.initialSort || Object.keys(sorters)[0],
      previewUrl: null,
      previewEnabled: false
    }
  }
  renderTable () {
    return (
      <table style={{ borderSpacing: 4 }}>
        <thead>
          <tr>
            <th colSpan={4}>
              {this.renderSorter()}
              {' · '}
              {this.renderPreview()}
            </th>
          </tr>
          <tr>
            <th>id</th>
            <th>song</th>
            <th>warnings</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    )
  }
  renderSorter () {
    const out = []
    for (const key of Object.keys(sorters)) {
      out.push(
        <button
          key={key}
          onClick={() => {
            this.setState({ sort: key })
          }}
        >
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
  renderPreview () {
    const button = (
      <button
        onClick={() => {
          this.setState(s => ({ previewEnabled: !s.previewEnabled }))
        }}
      >
        {this.state.previewEnabled ? 'disable' : 'enable'}
      </button>
    )
    return (
      <span>
        <strong>Music preview:</strong> {button}
        {this.state.previewEnabled && (
          <MusicSelectPreviewer url={this.state.previewUrl} />
        )}
      </span>
    )
  }
  renderRows () {
    const categories = sorters[this.state.sort](this.props.data.songs)
    const out = []
    for (const category of categories) {
      out.push(
        <tr key={category.title}>
          <th colSpan={4}>{category.title}</th>
        </tr>
      )
      for (const song of category.songs) {
        out.push(
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
                onClick={() => {
                  const previewUrl = getPreviewUrl(this.props.url, song)
                  this.setState({ previewUrl })
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
            <td>{renderSongWarnings(song)}</td>
          </tr>
        )
      }
    }
    return out
  }
  renderMessage (text) {
    return <div style={{ textAlign: 'center' }}>{text}</div>
  }
  render () {
    if (!this.props.data) return this.renderMessage('No data')
    try {
      return this.renderTable()
    } catch (e) {
      return this.renderMessage(`Error: ${e}`)
    }
  }
}

export default MusicTable
