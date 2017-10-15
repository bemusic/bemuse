
import './MusicChartInfo.scss'

import React from 'react'

const MusicChartInfo = ({ info }) => (
  <section className="MusicChartInfo">
    <div className="MusicChartInfoのgenre">{info.genre}</div>
    <div className="MusicChartInfoのtitle">{info.title}</div>
    {info.subtitles.map((text, index) =>
      <div className="MusicChartInfoのsubtitle" key={index}>{text}</div>)}
    <div className="MusicChartInfoのartist">
      {info.artist}
      {
        info.subartists.length
          ? <small>{' · ' + info.subartists.join(' · ')}</small>
          : null
      }
    </div>
  </section>
)

export default MusicChartInfo
