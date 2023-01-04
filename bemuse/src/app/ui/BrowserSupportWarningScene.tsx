import './BrowserSupportWarningScene.scss'

import { ReactScene, SceneManager } from 'bemuse/scene-manager'

import OptionsButton from './OptionsButton'
import React from 'react'
import { SUPPORTED } from '../browser-support'
import Scene from 'bemuse/ui/Scene'

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
          separator(index, array.length),
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

const separator = (index: number, length: number): string => {
  if (index === 0) {
    return ' '
  }
  if (index === length - 1) {
    return ' and '
  }
  return ', '
}

export default BrowserSupportWarningScene
