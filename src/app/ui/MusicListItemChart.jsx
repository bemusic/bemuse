
import './MusicListItemChart.scss'
import React from 'react'
import c from 'classnames'

export default class MusicListItemChart extends React.Component {
  render () {
    const chart = this.props.chart
    const className = c('MusicListItemChart', {
      'is-played': this.props.played,
      'is-selected': !!this.props.selected,
      'is-grade': !!this.props.grade,
    })
    return <div className={className} onClick={this.handleClick}>
      <span className="MusicListItemChartのtext">
        {this.props.loading
          ? '…'
          : this.props.grade || chart.info.level
        }
      </span>
    </div>
  }

  handleClick = (e) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.chart, e)
    }
  }
}
