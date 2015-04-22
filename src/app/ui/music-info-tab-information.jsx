
import './music-info-tab-information.scss'

import React  from 'react'
import c      from 'classnames'

import { Binding } from 'bemuse/flux'
import ReadmeStore from '../stores/readme-store'

import Markdown from 'bemuse/ui/markdown'

export default React.createClass({

  render() {
    const song = this.props.song
    return <div className="music-info-tab-information">
      <Binding store={ReadmeStore} onChange={this.handleReadme} />
      {this.renderButtons()}
      <p className="music-info-tab-information--artist">
        <span>Artist:</span>
        <strong>{link(song.artist, song.artist_url)}</strong>
      </p>
      <section className="music-info-tab-information--readme">
        <Markdown source={this.state.readme.text} />
      </section>
    </div>
  },
  renderButtons() {
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
      return <p className="music-info-tab-information--buttons">{buttons}</p>
    }
  },
  getInitialState() {
    return { readme: ReadmeStore.get() }
  },
  handleReadme(readme) {
    this.setState({ readme: readme })
  },

})

function link(text, url) {
  return (
    url
    ? <a href={url} target="_blank">{text}</a>
    : text
  )
}
