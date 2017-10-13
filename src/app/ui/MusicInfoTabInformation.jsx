
import './MusicInfoTabInformation.scss'

import React      from 'react'
import PropTypes  from 'prop-types'

import { connect } from 'react-redux'
import connectIO from '../../impure-react/connectIO'
import { compose } from 'recompose'
import * as ReadmeIO from '../io/ReadmeIO'
import * as ReduxState from '../redux/ReduxState'

import Markdown from 'bemuse/ui/Markdown'
import YouTube  from 'bemuse/ui/YouTube'

const enhance = compose(
  connect((state) => ({
    readme: ReduxState.selectReadmeTextForSelectedSong(state)
  })),
  connectIO({
    onRequestReadme: () => (song) => ReadmeIO.requestReadme(song)
  })
)

class MusicInfoTabInformation extends React.Component {
  static propTypes = {
    song: PropTypes.object,
    readme: PropTypes.string,
    onRequestReadme: PropTypes.func
  }

  constructor () {
    super()
  }

  componentDidMount () {
    this.props.onRequestReadme(this.props.song)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.song !== this.props.song) {
      this.props.onRequestReadme(nextProps.song)
    }
  }

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
        <Markdown source={this.props.readme} />
      </section>
    </div>
  }

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
    if (song.bmssearch_id) {
      buttons.push(link('BMS Search', 'http://bmssearch.net/bms?id=' + song.bmssearch_id))
    }
    if (buttons.length === 0) {
      return null
    } else {
      return <p className="MusicInfoTabInformationのbuttons">{buttons}</p>
    }
  }
}

export default enhance(MusicInfoTabInformation)

function link (text, url) {
  return (
    url
    ? <a key={text} href={url} target="_blank">{text}</a>
    : text
  )
}
