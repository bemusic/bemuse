
import './MusicInfoTabs.scss'

import React  from 'react'
import c      from 'classnames'
import Icon   from 'react-fa'

import MusicInfoTabStats        from './MusicInfoTabStats.jsx'
import MusicInfoTabInformation  from './MusicInfoTabInformation.jsx'
import RankingContainer         from './RankingContainer'

export default React.createClass({

  render () {
    return <section className="MusicInfoTabs">
      <ul className="MusicInfoTabsのtabs">
        <li className="MusicInfoTabsのoptions" onClick={this.props.onOptions}>
          <Icon name="gear" /> Options
        </li>
        {this.renderTab(0, 'Stats')}
        {this.renderTab(1, 'Ranking')}
        {this.renderTab(2, 'Information')}
      </ul>
      <div
        className={c('MusicInfoTabsのpanel',
              { 'is-without-padding': this.state.selectedTab === 1 })}>
        {this.renderCurrentTab()}
      </div>
    </section>
  },

  renderTab (index, title) {
    const onClick = () => this.setState({ selectedTab: index })
    return <li
      className={c('MusicInfoTabsのtab', {
        'is-active': index === this.state.selectedTab
      })}
      onClick={onClick}
    >
      {title}
    </li>
  },
  renderCurrentTab () {
    switch (this.state.selectedTab) {
    case 0:
      return <MusicInfoTabStats
        song={this.props.song}
        chart={this.props.chart} />
    case 1:
      return <RankingContainer
        chart={this.props.chart}
        playMode={this.props.playMode} />
    case 2:
      return <MusicInfoTabInformation
        song={this.props.song}
        chart={this.props.chart} />
    default:
      return 'Unknown tab'
    }
  },

  getInitialState () {
    return {
      selectedTab: 0,
    }
  },

})
