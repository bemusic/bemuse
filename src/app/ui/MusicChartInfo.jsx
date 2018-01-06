import './MusicChartInfo.scss'

import React from 'react'
import PropTypes from 'prop-types'

const MusicChartInfo = ({ info }) => (
  <section className='MusicChartInfo'>
    <div className='MusicChartInfoのgenre'>{info.genre}</div>
    <div className='MusicChartInfoのtitle'>{info.title}</div>
    {info.subtitles.map((text, index) => (
      <div className='MusicChartInfoのsubtitle' key={index}>
        {text}
      </div>
    ))}
    <div className='MusicChartInfoのartist'>
      {info.artist}
      {info.subartists.length ? (
        <small>{' · ' + info.subartists.join(' · ')}</small>
      ) : null}
    </div>
  </section>
)

MusicChartInfo.propTypes = {
  info: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    genre: PropTypes.string,
    subtitles: PropTypes.arrayOf(PropTypes.string),
    subartists: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.number,
    level: PropTypes.number
  })
}

export default MusicChartInfo
