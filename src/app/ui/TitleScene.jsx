import './TitleScene.scss'

import $ from 'jquery'
import HomePage from 'bemuse/site/HomePage'
import ModalPopup from 'bemuse/ui/ModalPopup'
import PropTypes from 'prop-types'
import React from 'react'
import SCENE_MANAGER from 'bemuse/scene-manager'
import Scene from 'bemuse/ui/Scene'
import SceneToolbar from 'bemuse/ui/SceneToolbar'
import TipContainer from 'bemuse/ui/TipContainer'
import screenfull from 'screenfull'
import version from 'bemuse/utils/version'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { shouldDisableFullScreen } from 'bemuse/devtools/query-flags'

import * as Analytics from '../analytics'
import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'
import AboutScene from './AboutScene'
import ChangelogPanel from './ChangelogPanel'
import FirstTimeTip from './FirstTimeTip'
import ModeSelectScene from './ModeSelectScene'
import connectIO from '../../impure-react/connectIO'

const HAS_PARENT = (() => {
  try {
    return window.parent !== window
  } catch (e) {
    return false
  }
})()

const enhance = compose(
  connectIO({
    onMarkChangelogAsSeen: () => () =>
      OptionsIO.updateOptions(Options.updateLastSeenVersion(version))
  }),
  connect(state => ({
    hasSeenChangelog: Options.lastSeenVersion(state.options) === version
  }))
)

class TitleScene extends React.Component {
  static propTypes = {
    hasSeenChangelog: PropTypes.bool,
    onTwitterButtonClick: PropTypes.func,
    onMarkChangelogAsSeen: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      changelogModalVisible: false
    }
  }

  render () {
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
        <SceneToolbar>
          <a onClick={this.showAbout} href='javascript://'>
            About
          </a>
          <a onClick={this.openLink} href='https://bemuse.readthedocs.org'>
            Docs
          </a>
          <a onClick={() => this.viewChangelog()} href='javascript://'>
            {this.renderVersion()}
          </a>
          <SceneToolbar.Spacer />
          <a
            onClick={() => this.openLink()}
            href='https://www.facebook.com/bemusegame'
          >
            Facebook
          </a>
          <a
            onClick={() => this.openTwitterLink()}
            href='https://twitter.com/bemusegame'
          >
            <FirstTimeTip tip='Like & follow us :)' featureKey='twitter'>
              Twitter
            </FirstTimeTip>
          </a>
          <a onClick={this.openLink} href='https://github.com/bemusic/bemuse'>
            Fork me on GitHub
          </a>
        </SceneToolbar>
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

  renderVersion () {
    return (
      <TipContainer tip='What’s new?' tipVisible={!this.props.hasSeenChangelog}>
        <strong>Bemuse</strong> v{version}
      </TipContainer>
    )
  }

  openLink (e) {
    e.preventDefault()
    window.open(
      $(e.target)
        .closest('a')
        .get(0).href,
      '_blank'
    )
  }

  openTwitterLink (e) {
    this.openLink(e)
    this.props.onTwitterButtonClick()
  }

  enterGame () {
    SCENE_MANAGER.push(<ModeSelectScene />).done()
    Analytics.send('TitleScene', 'enter game')
    // go fullscreen
    if (screenfull.enabled && !shouldDisableFullScreen()) {
      let safari =
        /Safari/.test(navigator.userAgent) && !/Chrom/.test(navigator.userAgent)
      if (!safari) screenfull.request()
    }
  }

  showAbout () {
    SCENE_MANAGER.push(<AboutScene />).done()
    Analytics.send('TitleScene', 'show about')
  }

  viewChangelog () {
    this.toggleChangelogModal()
    this.props.onMarkChangelogAsSeen()
    Analytics.send('TitleScene', 'view changelog')
  }

  toggleChangelogModal () {
    this.setState({ changelogModalVisible: !this.state.changelogModalVisible })
  }
}

export default enhance(TitleScene)
