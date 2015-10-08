
import './MusicListItemChart.scss'
import React from 'react'
import c from 'classnames'

export default React.createClass({
  render() {
    const chart = this.props.chart
    const className = c('MusicListItemChart', {
      'is-played': this.props.played,
      'is-grade': !!this.props.grade,
    })
    return <div className={className}>
      {this.props.grade ? this.props.grade : chart.info.level}
    </div>
  }
})
