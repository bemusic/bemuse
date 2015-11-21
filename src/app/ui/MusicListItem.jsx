
import './MusicListItem.scss'

import React  from 'react'
import c      from 'classnames'

import { visibleCharts } from '../utils/music-select-utils'

import MusicListItemCharts from './MusicListItemCharts'

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render () {
    const song = this.props.song
    const className = c('MusicListItem', {
      'is-active': this.props.selected,
      'js-active-song': this.props.selected,
    })
    return <li
        className={className}
        onClick={this.handleClick}>
      {
        song.tutorial
        ? (
          <div className="MusicListItemのtutorial">
            <div className="MusicListItemのcharts">
              {this.renderChartlist()}
            </div>
            Tutorial
          </div>
        )
        : (
          <div className="MusicListItemのinfo">
            <div className="MusicListItemのinfo-top">
              <div className="MusicListItemのtitle">
                {this.renderHighlight(song.title)}
              </div>
              <div className="MusicListItemのcharts">
                {this.renderChartlist()}
              </div>
            </div>
            <div className="MusicListItemのinfo-bottom">
              <div className="MusicListItemのartist">
                {this.renderHighlight(song.artist)}
              </div>
              <div className="MusicListItemのgenre">
                {this.renderHighlight(song.genre)}
              </div>
            </div>
          </div>
        )
      }
    </li>
  },
  renderChartlist () {
    return <MusicListItemCharts
      charts={visibleCharts(this.props.song.charts)}
      selectedChart={this.props.selectedChart}
      onChartClick={this.handleChartClick}
      playMode={this.props.playMode} />
  },
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
        output.push(<span
            className="MusicListItemのhighlight">{highlightedText}</span>)
        start += highlight.length
      }
    }
    return output
  },

  handleClick () {
    this.props.onSelect(this.props.song)
  },
  handleChartClick (chart, e) {
    e.stopPropagation()
    this.props.onSelect(this.props.song, chart)
  },

})
