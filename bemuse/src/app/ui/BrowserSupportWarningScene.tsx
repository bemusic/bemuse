import './BrowserSupportWarningScene.scss'

import OptionsButton from './OptionsButton'
import React from 'react'
import { ReactScene } from 'bemuse/scene-manager/scene'
import { SUPPORTED } from '../browser-support'
import Scene from 'bemuse/ui/Scene'
import { SceneManager } from 'bemuse/scene-manager'

const BrowserSupportWarningScene = ({
  next,
  sceneManager,
}: {
  next: ReactScene | JSX.Element
  sceneManager: SceneManager
}) => {
  const handleContinue = () => {
    sceneManager.display(next)
  }

  return (
    <Scene className='BrowserSupportWarningScene'>
      <h1>Warning: Unsupported Browser</h1>
      <p>
        It seems that you are using an unsupported browser.
        <br />
        This game may not work correctly.
      </p>
      <p>
        We support
        {SUPPORTED.map((browser, index, array) => [
          !index ? ' ' : index === array.length - 1 ? ' and ' : ', ',
          <strong key={browser.name}>{browser.name}</strong>,
        ])}
        .
      </p>
      <p>
        <OptionsButton onClick={handleContinue}>Continue Anyway</OptionsButton>
      </p>
      <p className='BrowserSupportWarningSceneのuserAgent'>
        <strong>User agent:</strong> {navigator.userAgent}
      </p>
    </Scene>
  )
}

export default BrowserSupportWarningScene
