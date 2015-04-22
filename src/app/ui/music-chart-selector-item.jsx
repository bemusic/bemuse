
import './music-chart-selector-item.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render() {
    let classes = c('music-chart-selector-item', {
          'is-active': this.props.isSelected,
          'is-tutorial': this.props.isTutorial,
        })
    return <li
        className={classes}
        onClick={this.handleClick}>
      {
        this.props.isTutorial
        ? 'Start Tutorial'
        : this.props.chart.info.level
      }
    </li>
  },

  handleClick() {
    this.props.onChartClick(this.props.chart)
  },

})
