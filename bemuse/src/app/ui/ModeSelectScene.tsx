import './ModeSelectScene.scss'

import * as Analytics from '../analytics'

import React, { useContext, useRef } from 'react'

import { MappingMode } from 'bemuse/rules/mapping-mode'
import MusicSelectScene from './MusicSelectScene'
import Scene from 'bemuse/ui/Scene'
import SceneHeading from 'bemuse/ui/SceneHeading'
import { SceneManagerContext } from 'bemuse/scene-manager'
import SceneToolbar from 'bemuse/ui/SceneToolbar'
import { optionsSlice } from '../entities/Options'
import { useDispatch } from 'react-redux'

function KBGraphics() {
  const children = []
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

function BMGraphics() {
  const children = []
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

type PlayDevice = 'touch' | 'keyboard' | null

const ModeSelectScene = () => {
  const sceneManager = useContext(SceneManagerContext)
  const dispatch = useDispatch()
  const playDevice = useRef<PlayDevice>(null)

  const onSetMode = (mode: MappingMode) => {
    if (
      playDevice.current === 'touch' &&
      window.innerWidth >= window.innerHeight &&
      mode === 'KB'
    ) {
      dispatch(optionsSlice.actions.CHANGE_PANEL_PLACEMENT({ placement: '3d' }))
    } else {
      dispatch(optionsSlice.actions.CHANGE_PLAY_MODE({ mode }))
    }
  }

  const setPlayDevice = (device: PlayDevice) => {
    console.log('Set play device to', device)
    if (!playDevice.current) {
      playDevice.current = device
    }
  }
  const handleKB = () => {
    onSetMode('KB')
    sceneManager.display(<MusicSelectScene />)
    Analytics.send('ModeSelectScene', 'select mode', 'KB')
  }
  const handleBM = () => {
    onSetMode('BM')
    sceneManager.display(<MusicSelectScene />)
    Analytics.send('ModeSelectScene', 'select mode', 'BM')
  }
  const handleBack = () => {
    sceneManager.pop()
  }

  return (
    <Scene className='ModeSelectScene'>
      <SceneHeading>Select Mode</SceneHeading>
      <div className='ModeSelectSceneのmain'>
        <div
          className='ModeSelectSceneのcontent'
          onTouchStart={() => setPlayDevice('touch')}
          onMouseDown={() => setPlayDevice('keyboard')}
        >
          <div
            className='ModeSelectSceneのitem'
            onClick={handleKB}
            data-testid='keyboard-mode'
          >
            <KBGraphics />
            <h2>Keyboard Mode</h2>
            <p>
              Keys are arranged like computer keyboard.{' '}
              <strong>Recommended for new players.</strong>
            </p>
            <p>This mode is similar to O2Jam.</p>
          </div>
          <div
            className='ModeSelectSceneのitem'
            onClick={handleBM}
            data-testid='bms-mode'
          >
            <BMGraphics />
            <h2>BMS Mode</h2>
            <p>
              Keys are arranged like piano keyboard with a special scratch lane.{' '}
              <strong>For advanced BMS music gamers.</strong>
            </p>
            <p>This mode is similar to beatmaniaIIDX and LR2.</p>
          </div>
        </div>
      </div>
      <SceneToolbar>
        <a onClick={handleBack}>Go Back</a>
      </SceneToolbar>
    </Scene>
  )
}

export default ModeSelectScene
