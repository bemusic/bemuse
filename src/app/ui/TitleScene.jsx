
import './TitleScene.scss'

import $                from 'jquery'
import React            from 'react'
import Scene            from 'bemuse/ui/Scene'
import SceneToolbar     from 'bemuse/ui/SceneToolbar'
import ModalPopup       from 'bemuse/ui/ModalPopup'
import SCENE_MANAGER    from 'bemuse/scene-manager'
import version          from 'bemuse/utils/version'
import * as Analytics   from '../analytics'
import ModeSelectScene  from './ModeSelectScene'
import AboutScene       from './AboutScene'
import ChangelogPanel   from './ChangelogPanel'
import { connect }      from 'react-redux'
import connectIO        from '../../impure-react/connectIO'
import { compose }      from 'recompose'
import * as OptionsIO   from '../io/OptionsIO'
import HomePage         from 'bemuse/site/HomePage'
import TipContainer     from 'bemuse/ui/TipContainer'
import FirstTimeTip     from './FirstTimeTip'

const enhance = compose(
  connectIO({
    onMarkChangelogAsSeen: () => () => (
      OptionsIO.setOptions({ 'system.last-seen-version': version })
    )
  }),
  connect((state) => ({
    hasSeenChangelog: state.options['system.last-seen-version'] === version
  })
))

export const TitleScene = React.createClass({
  propTypes: {
    hasSeenChangelog: React.PropTypes.bool,
    clickedTwitterButton: React.PropTypes.bool,
    onMarkChangelogAsSeen: React.PropTypes.func.isRequired,
  },
  getInitialState () {
    return {
      changelogModalVisible: false,
    }
  },
  render () {
    return <Scene className="TitleScene">
      <div className="TitleSceneのimage"></div>
      <div className="TitleSceneのpage">
        <div className="TitleSceneのpageTitle">
          <div className="TitleSceneのlogo">
            <div className="TitleSceneのtagline">
              online, web-based rhythm game
            </div>
            <img src={require('./images/logo-with-shadow.svg')} />
          </div>
          <div className="TitleSceneのenter">
            <a href="javascript://" onClick={this.enterGame}>Enter Game</a>
          </div>
        </div>
        <div className="TitleSceneのpageContents">
          <HomePage />
        </div>
      </div>
      <SceneToolbar>
        <a onClick={this.showAbout} href="javascript://">About</a>
        <a onClick={this.openLink} href="https://bemuse.readthedocs.org">Docs</a>
        <a onClick={this.viewChangelog} href="javascript://">{this.renderVersion()}</a>
        <SceneToolbar.Spacer />
        <a onClick={this.openLink} href="https://www.facebook.com/bemusegame">Facebook</a>
        <a onClick={this.openTwitterLink} href="https://twitter.com/bemusegame">
          <FirstTimeTip tip="Like & follow us :)" featureKey="twitter">
            Twitter
          </FirstTimeTip>
        </a>
        <a onClick={this.openLink} href="https://github.com/bemusic/bemuse">Fork me on GitHub</a>
      </SceneToolbar>
      <div className="TitleSceneのcurtain"></div>
      <ModalPopup
        visible={this.state.changelogModalVisible}
        onBackdropClick={this.toggleChangelogModal}
      >
        <ChangelogPanel />
      </ModalPopup>
    </Scene>
  },

  renderVersion () {
    return (
      <TipContainer tip="What’s new?" tipVisible={!this.props.hasSeenChangelog}>
        <strong>Bemuse</strong> v{version}
      </TipContainer>
    )
  },

  openLink (e) {
    e.preventDefault()
    window.open($(e.target).closest('a').get(0).href, '_blank')
  },
  openTwitterLink (e) {
    this.openLink(e)
    this.props.onTwitterButtonClick()
  },
  enterGame () {
    SCENE_MANAGER.push(<ModeSelectScene />).done()
    Analytics.send('TitleScene', 'enter game')
  },
  showAbout () {
    SCENE_MANAGER.push(<AboutScene />).done()
    Analytics.send('TitleScene', 'show about')
  },
  viewChangelog () {
    this.toggleChangelogModal()
    this.props.onMarkChangelogAsSeen()
    Analytics.send('TitleScene', 'view changelog')
  },
  toggleChangelogModal () {
    this.setState({ changelogModalVisible: !this.state.changelogModalVisible })
  },

})

export default enhance(TitleScene)
