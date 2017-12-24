import * as Analytics from '../analytics'
import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'
import './ModeSelectScene.scss'

import React from 'react'
import PropTypes from 'prop-types'
import Scene from 'bemuse/ui/Scene'
import SCENE_MANAGER from 'bemuse/scene-manager'
import SceneHeading from 'bemuse/ui/SceneHeading'
import SceneToolbar from 'bemuse/ui/SceneToolbar'

import connectIO from '../../impure-react/connectIO'
import MusicSelectScene from './MusicSelectScene'

const enhance = connectIO({
  onSetMode: () => mode => OptionsIO.updateOptions(Options.changePlayMode(mode))
})

class ModeSelectScene extends React.Component {
  static propTypes = {
    onSetMode: PropTypes.func
  }

  render () {
    return (
      <Scene className='ModeSelectScene'>
        <SceneHeading>Select Mode</SceneHeading>
        <div className='ModeSelectSceneのmain'>
          <div className='ModeSelectSceneのcontent'>
            <div className='ModeSelectSceneのitem' onClick={this.handleKB}>
              {this.renderKBGraphics()}
              <h2>Keyboard Mode</h2>
              <p>
                Keys are arranged like computer keyboard.{' '}
                <strong>Recommended for new players.</strong>
              </p>
              <p>This mode is similar to O2Jam.</p>
            </div>
            <div className='ModeSelectSceneのitem' onClick={this.handleBM}>
              {this.renderBMGraphics()}
              <h2>BMS Mode</h2>
              <p>
                Keys are arranged like piano keyboard with a special scratch
                lane. <strong>For advanced BMS music gamers.</strong>
              </p>
              <p>This mode is similar to beatmaniaIIDX and LR2.</p>
            </div>
          </div>
        </div>
        <SceneToolbar>
          <a onClick={this.handleBack} href='javascript://'>
            Go Back
          </a>
        </SceneToolbar>
      </Scene>
    )
  }

  renderKBGraphics () {
    let children = []
    for (let i = 0; i < 7; i++) {
      if (i === 3) {
        children.push(
          <rect
            key={i}
            x={13 + 3.5}
            y='31'
            width='63'
            height='11'
            rx='2'
            ry='2'
          />
        )
      } else {
        children.push(
          <rect
            key={i}
            x={13 * i + 3.5}
            y='13'
            width='11'
            height='11'
            rx='2'
            ry='2'
          />
        )
      }
    }
    return (
      <svg
        width='96'
        height='54'
        viewBox='0 0 96 54'
        className='ModeSelectSceneのgraphics'
      >
        {children}
      </svg>
    )
  }

  renderBMGraphics () {
    let children = []
    for (let i = 0; i < 7; i++) {
      children.push(
        <rect
          key={i}
          x={6.5 * i + 41.5}
          y={i % 2 === 0 ? 28 : 12}
          width='11'
          height='14'
          rx='2'
          ry='2'
        />
      )
    }
    return (
      <svg
        width='96'
        height='54'
        viewBox='0 0 96 54'
        className='ModeSelectSceneのgraphics'
      >
        <circle cx='21' cy='27' r='16' />
        {children}
      </svg>
    )
  }

  handleKB = () => {
    this.props.onSetMode('KB')
    SCENE_MANAGER.display(<MusicSelectScene />).done()
    Analytics.send('ModeSelectScene', 'select mode', 'KB')
  }

  handleBM = () => {
    this.props.onSetMode('BM')
    SCENE_MANAGER.display(<MusicSelectScene />).done()
    Analytics.send('ModeSelectScene', 'select mode', 'BM')
  }

  handleBack = () => {
    SCENE_MANAGER.pop().done()
  }
}

export default enhance(ModeSelectScene)
