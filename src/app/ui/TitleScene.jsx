
import './TitleScene.scss'

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

const enhance = compose(
  connectIO({
    onMarkChangelogAsSeen: () => () => (
      OptionsIO.setOptions({ 'system.last-seen-version': version })
    )
  }),
  connect((state) => ({
    hasSeenChangelog: state.options['system.last-seen-version'] === version,
  })
))

export const TitleScene = React.createClass({
  propTypes: {
    hasSeenChangelog: React.PropTypes.bool,
    onMarkChangelogAsSeen: React.PropTypes.func.isRequired,
  },
  getInitialState () {
    return {
      changelogModalVisible: false,
    }
  },
  render () {
    return <Scene className="TitleScene">
      <div className="TitleSceneのlogo">
        <div className="TitleSceneのtagline">
          online, web-based rhythm game
        </div>
        <img src={require('./images/logo-with-shadow.svg')} />
      </div>
      <div className="TitleSceneのenter">
        <a href="javascript://" onClick={this.enterGame}>Enter Game</a>
      </div>
      <SceneToolbar>
        <a onClick={this.showAbout} href="javascript://">About</a>
        <a onClick={this.openLink} href="https://bemuse.readthedocs.org">Docs</a>
        <a onClick={this.viewChangelog} href="javascript://">{this.renderVersion()}</a>
        <SceneToolbar.Spacer />
        <a onClick={this.openLink} href="https://www.facebook.com/bemusegame">Facebook</a>
        <a onClick={this.openLink} href="https://twitter.com/bemusegame">Twitter</a>
        <a onClick={this.openLink} href="https://medium.com/bemuse-blog">Blog</a>
        <a onClick={this.openLink} href="https://github.com/bemusic/bemuse">GitHub</a>
        <a onClick={this.openLink} href="https://gitter.im/bemusic/bemuse">Chat</a>
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
      <span className="TitleSceneのversion">
        <strong>Bemuse</strong> v{version}
        {!this.props.hasSeenChangelog
          ? this.renderNewVersionBubble()
          : null
        }
      </span>
    )
  },
  renderNewVersionBubble () {
    return (
      <span className="TitleSceneのnewVersion">
        <span className="TitleSceneのnewVersionContent">
          What’s new?
        </span>
      </span>
    )
  },

  openLink (e) {
    e.preventDefault()
    window.open(e.target.href, '_blank')
  },
  enterGame () {
    SCENE_MANAGER.push(<ModeSelectScene />).done()
    Analytics.action('TitleScene:enterGame')
  },
  showAbout () {
    SCENE_MANAGER.push(<AboutScene />).done()
    Analytics.action('TitleScene:showAbout')
  },
  viewChangelog () {
    this.toggleChangelogModal()
    this.props.onMarkChangelogAsSeen()
    Analytics.action('TitleScene:viewChangelog')
  },
  toggleChangelogModal () {
    this.setState({ changelogModalVisible: !this.state.changelogModalVisible })
  },

})

export default enhance(TitleScene)
