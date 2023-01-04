import './BrowserSupportWarningScene.scss'

import Scene from 'bemuse/ui/Scene'
import React, { useContext } from 'react'
import { ReactScene, SceneManagerContext } from 'bemuse/scene-manager'

import OptionsButton from './OptionsButton'
import { SUPPORTED } from '../browser-support'

const BrowserSupportWarningScene = ({
  next,
}: {
  next: ReactScene | JSX.Element
}) => {
  const sceneManager = useContext(SceneManagerContext)

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
