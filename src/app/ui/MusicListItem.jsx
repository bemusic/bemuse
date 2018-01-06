import './MusicListItem.scss'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import getPlayableCharts from 'bemuse/music-collection/getPlayableCharts'

import MusicListItemCharts from './MusicListItemCharts'

const chartPropType = PropTypes.shape({
  bpm: PropTypes.shape({
    init: PropTypes.number,
    max: PropTypes.number,
    median: PropTypes.number,
    min: PropTypes.number
  }),
  duration: PropTypes.number,
  file: PropTypes.string,
  info: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    genre: PropTypes.string,
    subtitles: PropTypes.arrayOf(PropTypes.string),
    subartists: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.number,
    level: PropTypes.number
  }),
  keys: PropTypes.string,
  md5: PropTypes.string,
  noteCount: PropTypes.number
})

class MusicListItem extends React.PureComponent {
  static propTypes = {
    song: PropTypes.object,
    selected: PropTypes.bool,
    selectedChart: chartPropType,
    playMode: PropTypes.string,
    onSelect: PropTypes.func,
    highlight: PropTypes.string
  }

  render () {
    const song = this.props.song
    const className = c('MusicListItem', {
      'is-active': this.props.selected,
      'js-active-song': this.props.selected
    })
    return (
      <li className={className} onClick={this.handleClick}>
        {song.tutorial ? (
          <div className='MusicListItemのtutorial'>
            <div className='MusicListItemのcharts'>
              {this.renderChartlist()}
            </div>
            Tutorial
          </div>
        ) : (
          <div className='MusicListItemのinfo'>
            <div className='MusicListItemのinfo-top'>
              <div className='MusicListItemのtitle'>
                {this.renderHighlight(song.title)}
              </div>
              <div className='MusicListItemのcharts'>
                {this.renderChartlist()}
              </div>
            </div>
            <div className='MusicListItemのinfo-bottom'>
              <div className='MusicListItemのartist'>
                {this.renderHighlight(song.artist)}
              </div>
              <div className='MusicListItemのgenre'>
                {this.renderHighlight(song.genre)}
              </div>
            </div>
          </div>
        )}
      </li>
    )
  }

  renderChartlist () {
    return (
      <MusicListItemCharts
        charts={getPlayableCharts(this.props.song.charts)}
        selectedChart={this.props.selectedChart}
        onChartClick={this.handleChartClick}
        playMode={this.props.playMode}
      />
    )
  }

  renderHighlight (text) {
    if (!this.props.highlight) return text
    let highlight = this.props.highlight
    let segments = text.toLowerCase().split(highlight.toLowerCase())
    if (segments.length === 1) return text
    let output = []
    let start = 0
    for (let i = 0; i < segments.length; i++) {
      output.push(text.substr(start, segments[i].length))
      start += segments[i].length
      if (i !== segments.length - 1) {
        let highlightedText = text.substr(start, highlight.length)
        output.push(
          <span className='MusicListItemのhighlight'>{highlightedText}</span>
        )
        start += highlight.length
      }
    }
    return output
  }

  handleClick = () => {
    this.props.onSelect(this.props.song)
  }

  handleChartClick = (chart, e) => {
    e.stopPropagation()
    this.props.onSelect(this.props.song, chart)
  }
}

export default MusicListItem
