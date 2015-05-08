
import './title-scene.scss'

import React            from 'react'
import Scene            from 'bemuse/ui/scene'
import SceneToolbar     from 'bemuse/ui/scene-toolbar'
import SCENE_MANAGER    from 'bemuse/scene-manager'
import ModeSelectScene  from './mode-select-scene'
import AboutScene       from './about-scene'
import version          from 'bemuse/utils/version'

React.initializeTouchEvents(true)

export default React.createClass({

  render() {
    return <Scene className="title-scene">
      <div className="title-scene--logo"></div>
      <div className="title-scene--enter">
        <a href="javascript://" onClick={this.enterGame}>Enter Game</a>
      </div>
      <SceneToolbar>
        <a onClick={this.showAbout} href="javascript://">About</a>
        <span><strong>Bemuse</strong> v{version}</span>
        <SceneToolbar.Spacer />
        <a onClick={this.openLink} href="https://www.facebook.com/bemusegame">Facebook</a>
        <a onClick={this.openLink} href="https://twitter.com/bemusegame">Twitter</a>
        <a onClick={this.openLink} href="https://github.com/bemusic/bemuse">GitHub</a>
        <a onClick={this.openLink} href="https://www.reddit.com/r/bemuse">Community</a>
        <a onClick={this.openLink} href="https://gitter.im/bemusic/bemuse">Chat</a>
      </SceneToolbar>
    </Scene>
  },

  openLink(e) {
    e.preventDefault()
    window.open(e.target.href, '_blank')
  },

  enterGame() {
    SCENE_MANAGER.push(<ModeSelectScene />).done()
  },
  showAbout() {
    SCENE_MANAGER.push(<AboutScene />).done()
  },

})
