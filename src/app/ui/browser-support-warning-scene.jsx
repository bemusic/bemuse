
import './browser-support-warning-scene.scss'
import React from 'react'
import Scene from 'bemuse/ui/scene'

import OptionsButton from './options-button'
import { SUPPORTED } from '../browser-support'
import SCENE_MANAGER from 'bemuse/scene-manager'

export default React.createClass({
  render() {
    return <Scene className="BrowserSupportWarningScene">
      <h1>Warning: Unsupported Browser</h1>
      <p>
        It seems that you are using an unsupported browser.<br />
        This game may not work correctly.
      </p>
      <p>
        We support
        {SUPPORTED.map((browser, index, array) => [
          !index ? ' ' : index === array.length - 1 ? ' and ' : ', ',
          <strong>{browser.name}</strong>,
        ])}.
      </p>
      <p>
        <OptionsButton onClick={this.handleContinue}>
          Continue Anyway
        </OptionsButton>
      </p>
    </Scene>
  },
  handleContinue() {
    SCENE_MANAGER.display(this.props.next)
  },
})
