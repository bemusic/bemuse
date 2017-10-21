import './MusicChartSelectorItem.scss'

import Icon       from 'react-fa'
import React      from 'react'
import PropTypes  from 'prop-types'
import c          from 'classnames'

class MusicChartSelectorItem extends React.Component {
  static propTypes = {
    chart: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    isReplayable: PropTypes.bool,
    isTutorial: PropTypes.number,
    onChartClick: PropTypes.func.isRequired
  }

  render () {
    let classes = c('MusicChartSelectorItem', {
      'is-active': this.props.isSelected,
      'is-replayable': this.props.isReplayable,
      'is-tutorial': this.props.isTutorial,
      'is-insane': this.props.chart.info.difficulty >= 5,
      'is-5keys': this.props.chart.keys === '5K',
    })
    return <li
      className={classes}
      onClick={this.handleClick}>
      {
        this.props.isTutorial
        ? (this.props.chart.keys === '5K'
          ? 'Start Tutorial (5 keys)'
          : 'Start Tutorial (7 keys)'
        )
        : (
          <span className="MusicChartSelectorItemのlevel">
            {this.props.chart.info.level}
          </span>
        )
      }
      <span className="MusicChartSelectorItemのplay">
        <Icon name="play" />
      </span>
    </li>
  }

  handleClick = () => {
    this.props.onChartClick(this.props.chart)
  }
}

export default MusicChartSelectorItem
