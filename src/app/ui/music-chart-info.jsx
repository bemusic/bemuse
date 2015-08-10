
import './music-chart-info.scss'

import React from 'react'

export default React.createClass({

  render() {
    const info = this.props.info
    return <section className="music-chart-info">
      <div className="music-chart-info--genre">{info.genre}</div>
      <div className="music-chart-info--title">{info.title}</div>
      {info.subtitles.map((text, index) =>
        <div className="music-chart-info--subtitle" key={index}>{text}</div>)}
      <div className="music-chart-info--artist">
        {info.artist}
        {
          info.subartists.length
          ? <small>{' · ' + info.subartists.join(' · ')}</small>
          : null
        }
      </div>
    </section>
  }

})
