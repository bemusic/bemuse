import './MusicListItemChart.scss'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

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

export default class MusicListItemChart extends React.Component {
  static propTypes = {
    chart: chartPropType,
    grade: PropTypes.any,
    loading: PropTypes.bool,
    played: PropTypes.bool,
    selected: PropTypes.bool,
    onClick: PropTypes.func
  }

  render () {
    const { chart } = this.props
    const className = c('MusicListItemChart', {
      'is-played': this.props.played,
      'is-selected': !!this.props.selected,
      'is-grade': !!this.props.grade
    })
    return (
      <div className={className} onClick={this.handleClick}>
        <span className='MusicListItemChartのtext'>
          {this.props.loading ? '…' : this.props.grade || chart.info.level}
        </span>
      </div>
    )
  }

  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(this.props.chart, e)
    }
  }
}
