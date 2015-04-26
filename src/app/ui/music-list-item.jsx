
import './music-list-item.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render() {
    const song = this.props.song
    return <li
        className={c('music-list-item', { 'is-active': this.props.selected })}
        onClick={this.handleClick}>
      {
        song.tutorial
        ? <div className="music-list-item--tutorial">Tutorial</div>
        : <div className="music-list-item--info">
            <div className="music-list-item--title">
              {this.renderHighlight(song.title)}
            </div>
            <div className="music-list-item--artist">
              {this.renderHighlight(song.artist)}
            </div>
            <div className="music-list-item--genre">
              {this.renderHighlight(song.genre)}
            </div>
          </div>
      }
    </li>
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
            className="music-list-item--highlight">{highlightedText}</span>)
        start += highlight.length
      }
    }
    return output
  },

  handleClick() {
    this.props.onSelect(this.props.song)
  }

})
