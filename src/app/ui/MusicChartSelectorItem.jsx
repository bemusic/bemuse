
import './MusicChartSelectorItem.scss'

import React  from 'react'
import c      from 'classnames'
import Icon   from 'react-fa'

export default React.createClass({

  render () {
    let classes = c('MusicChartSelectorItem', {
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
        : <span className="MusicChartSelectorItemのlevel">
            {this.props.chart.info.level}
          </span>
      }
      <span className="MusicChartSelectorItemのplay">
        <Icon name="play" />
      </span>
    </li>
  },

  handleClick () {
    this.props.onChartClick(this.props.chart)
  },

})
