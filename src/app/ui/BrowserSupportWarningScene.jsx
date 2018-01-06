import './BrowserSupportWarningScene.scss'
import React from 'react'
import PropTypes from 'prop-types'
import Scene from 'bemuse/ui/Scene'

import OptionsButton from './OptionsButton'
import { SUPPORTED } from '../browser-support'
import SCENE_MANAGER from 'bemuse/scene-manager'

class BrowserSupportWarningScene extends React.Component {
  static propTypes = {
    next: PropTypes.element.isRequired
  }

  render () {
    return (
      <Scene className='BrowserSupportWarningScene'>
        <h1>Warning: Unsupported Browser</h1>
        <p>
          It seems that you are using an unsupported browser.<br />
          This game may not work correctly.
        </p>
        <p>
          We support
          {SUPPORTED.map((browser, index, array) => [
            !index ? ' ' : index === array.length - 1 ? ' and ' : ', ',
            <strong>{browser.name}</strong>
          ])}.
        </p>
        <p>
          <OptionsButton onClick={this.handleContinue}>
            Continue Anyway
          </OptionsButton>
        </p>
        <p className='BrowserSupportWarningSceneのuserAgent'>
          <strong>User agent:</strong> {navigator.userAgent}
        </p>
      </Scene>
    )
  }

  handleContinue = () => {
    SCENE_MANAGER.display(this.props.next)
  }
}

export default BrowserSupportWarningScene
