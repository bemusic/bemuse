
import './MusicInfoTabInformation.scss'

import React  from 'react'

import { connect } from 'bemuse/flux'
import ReadmeStore from '../stores/readme-store'

import Markdown from 'bemuse/ui/Markdown'
import YouTube  from 'bemuse/ui/YouTube'

export const MusicInfoTabInformation = React.createClass({

  render () {
    const song = this.props.song
    return <div className="MusicInfoTabInformation">
      {this.renderButtons()}
      <p className="MusicInfoTabInformationのartist">
        <span>Artist:</span>
        <strong>{link(song.artist, song.artist_url)}</strong>
      </p>
      {song.youtube_url ? <YouTube url={song.youtube_url} /> : null}
      <section className="MusicInfoTabInformationのreadme">
        <Markdown source={this.props.readme.text} />
      </section>
    </div>
  },
  renderButtons () {
    let buttons = []
    let song = this.props.song
    if (song.bms_url) {
      buttons.push(link('Download BMS', song.bms_url))
    }
    if (song.song_url) {
      let text = /soundcloud\.com/.test(song.song_url)
          ? 'SoundCloud' : 'Song URL'
      buttons.push(link(text, song.song_url))
    }
    if (song.long_url) {
      buttons.push(link('Long Version', song.long_url))
    }
    if (buttons.length === 0) {
      return null
    } else {
      return <p className="MusicInfoTabInformationのbuttons">{buttons}</p>
    }
  },
})

export default connect({ readme: ReadmeStore }, MusicInfoTabInformation)

function link (text, url) {
  return (
    url
    ? <a href={url} target="_blank">{text}</a>
    : text
  )
}
