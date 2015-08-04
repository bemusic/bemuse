
import './music-chart-selector-item.scss'

import React  from 'react'
import c      from 'classnames'
import Icon   from 'react-fa'

export default React.createClass({

  render() {
    let classes = c('music-chart-selector-item', {
          'is-active': this.props.isSelected,
          'is-tutorial': this.props.isTutorial,
          'is-insane': this.props.chart.info.difficulty >= 5,
          'is-5keys': this.props.chart.keys === '5K',
        })
    return <li
        className={classes}
        onClick={this.handleClick}>
      {
        this.props.isTutorial
        ? 'Start Tutorial'
        : <span className="music-chart-selector-item--level">
            {this.props.chart.info.level}
          </span>
      }
      <span className="music-chart-selector-item--play">
        <Icon name="play" />
      </span>
    </li>
  },

  handleClick() {
    this.props.onChartClick(this.props.chart)
  },

})
