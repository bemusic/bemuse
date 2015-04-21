
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
        song.selected
        ? <div className="music-list-item--tutorial">Tutorial</div>
        : <div className="music-list-item--info">
            <div className="music-list-item--title">{song.title}</div>
            <div className="music-list-item--artist">{song.artist}</div>
            <div className="music-list-item--genre">{song.genre}</div>
          </div>
      }
    </li>
  },

  handleClick() {
    this.props.onSelect(this.props.song)
  }

})
