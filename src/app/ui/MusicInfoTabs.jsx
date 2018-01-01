import './MusicInfoTabs.scss'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import Icon from 'react-fa'

import MusicInfoTabStats from './MusicInfoTabStats.jsx'
import MusicInfoTabInformation from './MusicInfoTabInformation.jsx'
import RankingContainer from './RankingContainer'

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

export default class MusicInfoTabs extends React.Component {
  static propTypes = {
    chart: chartPropType,
    onOptions: PropTypes.func,
    playMode: PropTypes.string,
    song: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 0
    }
  }

  render () {
    return (
      <section className='MusicInfoTabs'>
        <ul className='MusicInfoTabsのtabs'>
          <li className='MusicInfoTabsのoptions' onClick={this.props.onOptions}>
            <Icon name='gear' /> Options
          </li>
          {this.renderTab(0, 'Stats')}
          {this.renderTab(1, 'Ranking')}
          {this.renderTab(2, 'Information')}
        </ul>
        <div
          className={c('MusicInfoTabsのpanel', {
            'is-without-padding': this.state.selectedTab === 1
          })}
        >
          {this.renderCurrentTab()}
        </div>
      </section>
    )
  }

  renderTab (index, title) {
    const onClick = () => this.setState({ selectedTab: index })
    return (
      <li
        className={c('MusicInfoTabsのtab', {
          'is-active': index === this.state.selectedTab
        })}
        onClick={onClick}
      >
        {title}
      </li>
    )
  }

  renderCurrentTab () {
    switch (this.state.selectedTab) {
      case 0:
        return (
          <MusicInfoTabStats song={this.props.song} chart={this.props.chart} />
        )
      case 1:
        return (
          <RankingContainer
            chart={this.props.chart}
            playMode={this.props.playMode}
          />
        )
      case 2:
        return (
          <MusicInfoTabInformation
            song={this.props.song}
            chart={this.props.chart}
          />
        )
      default:
        return 'Unknown tab'
    }
  }
}
