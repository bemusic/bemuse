
import './MusicListItem.scss'

import React  from 'react'
import c      from 'classnames'

import { visibleCharts } from '../utils/music-select-utils'

import MusicListItemCharts from './MusicListItemCharts'

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    const song = this.props.song
    return <li
        className={c('MusicListItem', { 'is-active': this.props.selected })}
        onClick={this.handleClick}>
      {
        song.tutorial
        ? <div className="MusicListItemのtutorial">Tutorial</div>
        : <div className="MusicListItemのinfo">
            <div className="MusicListItemのinfo-top">
              <div className="MusicListItemのtitle">
                {this.renderHighlight(song.title)}
              </div>
              <div className="MusicListItemのcharts">
                {this.renderChartlist(song.charts)}
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
      }
    </li>
  },
  renderChartlist(charts) {
    return <MusicListItemCharts
      playMode={this.props.playMode}
      charts={visibleCharts(charts)} />
  },
  renderHighlight(text) {
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

  handleClick() {
    this.props.onSelect(this.props.song)
  }

})
