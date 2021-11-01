import './MusicChartSelectorItem.scss'

import Icon from 'react-fa'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

class MusicChartSelectorItem extends React.Component {
  static propTypes = {
    chart: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    isReplayable: PropTypes.bool,
    isTutorial: PropTypes.number,
    onChartClick: PropTypes.func.isRequired,
  }

  render() {
    let classes = c('MusicChartSelectorItem', {
      'is-active': this.props.isSelected,
      'is-replayable': this.props.isReplayable,
      'is-tutorial': this.props.isTutorial,
      'is-insane': this.props.chart.info.difficulty >= 5,
      'is-5keys': this.props.chart.keys === '5K',
    })
    return (
      <li
        className={classes}
        onClick={this.handleClick}
        data-testid={this.props.isSelected ? 'play-selected-chart' : undefined}
      >
        {this.renderText()}
        <span className='MusicChartSelectorItemのplay'>
          <Icon name='play' />
        </span>
      </li>
    )
  }
  renderText() {
    if (this.props.isTutorial) {
      const gameMode = this.props.chart.keys === '5K' ? '5 keys' : '7 keys'
      return `Start Tutorial (${gameMode})`
    }
    return (
      <span className='MusicChartSelectorItemのlevel'>
        {this.props.chart.info.level}
      </span>
    )
  }
  handleClick = (e) => {
    this.props.onChartClick(this.props.chart, e)
  }
}

export default MusicChartSelectorItem
