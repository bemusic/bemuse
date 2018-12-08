import './TitleScene.scss'

import $ from 'jquery'
import HomePage from 'bemuse/site/HomePage'
import ModalPopup from 'bemuse/ui/ModalPopup'
import PropTypes from 'prop-types'
import React from 'react'
import SCENE_MANAGER from 'bemuse/scene-manager'
import Scene from 'bemuse/ui/Scene'
import version from 'bemuse/utils/version'
import { hot } from 'react-hot-loader'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import connectIO from 'bemuse/impure-react/connectIO'

import * as Analytics from '../analytics'
import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'
import AboutScene from './AboutScene'
import ChangelogPanel from './ChangelogPanel'
import ModeSelectScene from './ModeSelectScene'
import Toolbar from './Toolbar'

const HAS_PARENT = (() => {
  try {
    return window.parent !== window
  } catch (e) {
    return false
  }
})()

const enhance = compose(
  hot(module),
  connectIO({
    onMarkChangelogAsSeen: () => () =>
      OptionsIO.updateOptions(Options.updateLastSeenVersion(version)),
  }),
  connect(state => ({
    hasSeenChangelog: Options.lastSeenVersion(state.options) === version,
  }))
)

class TitleScene extends React.Component {
  static propTypes = {
    hasSeenChangelog: PropTypes.bool,
    onTwitterButtonClick: PropTypes.func,
    onMarkChangelogAsSeen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      changelogModalVisible: false,
    }
  }

  getToolbarItems() {
    return [
      Toolbar.item('About', {
        onClick: this.showAbout,
      }),
      Toolbar.item('Docs', {
        href: '/project/',
      }),
      Toolbar.item(this.renderVersion(), {
        onClick: this.viewChangelog,
        tip: 'What’s new?',
        tipVisible: !this.props.hasSeenChangelog,
      }),
      Toolbar.spacer(),
      Toolbar.item('Discord', {
        href: 'https://discord.gg/aB6ucmx',
        tip: 'Join our Discord server',
        tipFeatureKey: 'discord',
      }),
      Toolbar.item('Facebook', {
        href: 'https://www.facebook.com/bemusegame',
      }),
      Toolbar.item('Twitter', {
        href: 'https://twitter.com/bemusegame',
        tip: 'Follow us :)',
        tipFeatureKey: 'twitter',
      }),
      Toolbar.item('Fork me on GitHub', {
        href: 'https://github.com/bemusic/bemuse',
      }),
    ]
  }

  render() {
    const shouldShowHomepage = !HAS_PARENT
    return (
      <Scene className='TitleScene'>
        <div className='TitleSceneのimage' />
        <div className='TitleSceneのpage'>
          <div className='TitleSceneのpageTitle'>
            <div className='TitleSceneのlogo'>
              <div className='TitleSceneのtagline'>
                online, web-based rhythm game
              </div>
              <img src={require('./images/logo-with-shadow.svg')} />
            </div>
            <div className='TitleSceneのenter'>
              <a href='javascript://' onClick={this.enterGame}>
                Enter Game
              </a>
            </div>
          </div>
          {shouldShowHomepage ? (
            <div className='TitleSceneのpageContents'>
              <HomePage />
            </div>
          ) : null}
        </div>
        <Toolbar items={this.getToolbarItems()} />
        <div className='TitleSceneのcurtain' />
        <ModalPopup
          visible={this.state.changelogModalVisible}
          onBackdropClick={() => this.toggleChangelogModal()}
        >
          <ChangelogPanel />
        </ModalPopup>
      </Scene>
    )
  }

  renderVersion() {
    return (
      <React.Fragment>
        <strong>Bemuse</strong> v{version}
      </React.Fragment>
    )
  }

  openLink = e => {
    e.preventDefault()
    window.open(
      $(e.target)
        .closest('a')
        .get(0).href,
      '_blank'
    )
  }

  openTwitterLink = e => {
    this.openLink(e)
    if (this.props.onTwitterButtonClick) this.props.onTwitterButtonClick()
  }

  enterGame() {
    SCENE_MANAGER.push(<ModeSelectScene />).done()
    Analytics.send('TitleScene', 'enter game')
  }

  showAbout() {
    SCENE_MANAGER.push(<AboutScene />).done()
    Analytics.send('TitleScene', 'show about')
  }

  viewChangelog = () => {
    this.toggleChangelogModal()
    this.props.onMarkChangelogAsSeen()
    Analytics.send('TitleScene', 'view changelog')
  }

  toggleChangelogModal() {
    this.setState({ changelogModalVisible: !this.state.changelogModalVisible })
  }
}

export default enhance(TitleScene)
