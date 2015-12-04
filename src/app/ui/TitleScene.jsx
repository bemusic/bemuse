
import './TitleScene.scss'

import React            from 'react'
import Scene            from 'bemuse/ui/Scene'
import SceneToolbar     from 'bemuse/ui/SceneToolbar'
import ModalPopup       from 'bemuse/ui/ModalPopup'
import SCENE_MANAGER    from 'bemuse/scene-manager'
import version          from 'bemuse/utils/version'
import * as Analytics   from '../analytics'
import OptionsStore     from '../stores/options-store'
import { setOptions }   from '../actions/options-actions'
import ModeSelectScene  from './ModeSelectScene'
import AboutScene       from './AboutScene'
import ChangelogPanel   from './ChangelogPanel'
import { connect }      from 'bemuse/flux'

React.initializeTouchEvents(true)

export const TitleScene = React.createClass({

  getInitialState () {
    return {
      changelogModalVisible: false,
    }
  },
  render () {
    return <Scene className="TitleScene">
      <div className="TitleSceneのlogo"></div>
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
    this.props.markChangelogAsSeen()
    Analytics.action('TitleScene:viewChangelog')
  },
  toggleChangelogModal () {
    this.setState({ changelogModalVisible: !this.state.changelogModalVisible })
  },

})

const titleScenePropsFromStore川 = OptionsStore.map(
  state => ({
    hasSeenChangelog: state.options['system.last-seen-version'] === version,
    markChangelogAsSeen () {
      setOptions({ 'system.last-seen-version': version })
    }
  })
)

export default connect(titleScenePropsFromStore川, TitleScene)
