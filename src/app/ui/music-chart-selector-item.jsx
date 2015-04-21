
import './music-chart-selector-item.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render() {
    let active = this.props.isSelected
    return <li
        className={c('music-chart-selector-item', { 'is-active': active })}
        onClick={this.handleClick}>
      {this.props.chart.info.level}
    </li>
  },

  handleClick() {
    this.props.onChartClick(this.props.chart)
  },

})
