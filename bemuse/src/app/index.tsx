import * as Analytics from './analytics'
import * as BemuseTestMode from '../devtools/BemuseTestMode'

import React, { Context, createContext, useContext } from 'react'
import { ReactScene, SceneManager } from 'bemuse/scene-manager'
import { collectionsSlice, customSongsSlice } from './redux/ReduxState'
import {
  getDefaultCustomFolderContext,
  getSongsFromCustomFolders,
} from 'bemuse/custom-folder'
import {
  getInitialGrepString,
  getMusicServer,
  getTimeSynchroServer,
} from './query-flags'
import {
  shouldShowAbout,
  shouldShowModeSelect,
} from 'bemuse/devtools/query-flags'

import AboutScene from './ui/AboutScene'
import BrowserSupportWarningScene from './ui/BrowserSupportWarningScene'
import ModeSelectScene from './ui/ModeSelectScene'
import { OFFICIAL_SERVER_URL } from 'bemuse/music-collection'
import TitleScene from './ui/TitleScene'
import configureStore from './redux/configureStore'
import { isBrowserSupported } from './browser-support'
import { loadInitialOptions } from './io/OptionsIO'
import { monetize } from 'monetizer'
import { musicSearchTextSlice } from './entities/MusicSearchText'
import now from 'bemuse/utils/now'

const store = configureStore()

export interface SceneManagerController {
  display(scene: ReactScene | JSX.Element): Promise<void>
  push(scene: ReactScene | JSX.Element): Promise<void>
  pop(): Promise<void>
}
const sceneManager: SceneManagerController = new SceneManager(store)
export const SceneManagerContext: Context<SceneManagerController> =
  createContext(sceneManager)
export const useSceneManager = () => useContext(SceneManagerContext)

// Allow hot reloading of some modules.
if (module.hot) {
  module.hot.accept('./redux/ReduxState', () => {})
}

function bootUp() {
  if (module.hot) {
    module.hot.accept('./redux/ReduxState', () => {
      store.replaceReducer(require('./redux/ReduxState').reducer)
    })
  }

  store.dispatch(
    collectionsSlice.actions.COLLECTION_LOADING_BEGAN({
      url: getMusicServer() || OFFICIAL_SERVER_URL,
    })
  )
  store.dispatch(
    musicSearchTextSlice.actions.MUSIC_SEARCH_TEXT_INITIALIZED({
      text: getInitialGrepString() ?? '',
    })
  )
  loadInitialOptions(store.dispatch)

  getSongsFromCustomFolders(getDefaultCustomFolderContext()).then((songs) => {
    if (songs.length > 0) {
      store.dispatch(customSongsSlice.actions.CUSTOM_SONGS_LOADED({ songs }))
    }
  })
}

export function main() {
  bootUp()
  displayFirstScene()

  // synchronize time
  const timeSynchroServer =
    getTimeSynchroServer() || 'wss://timesynchro.herokuapp.com/'
  if (timeSynchroServer) now.synchronize(timeSynchroServer)

  trackFullscreenEvents()

  // add web monetization meta tag
  monetize('$twitter.xrptipbot.com/bemusegame')
}

function displayFirstScene() {
  sceneManager.display(getFirstScene())
}

function getFirstScene() {
  if (shouldShowAbout()) {
    return React.createElement(AboutScene)
  }
  if (shouldShowModeSelect()) {
    return React.createElement(ModeSelectScene)
  }
  const scene = <TitleScene />
  if (!isBrowserSupported()) {
    return <BrowserSupportWarningScene next={scene} />
  }
  return scene
}

function trackFullscreenEvents() {
  let fullscreen = false
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement && !fullscreen) {
      fullscreen = true
      Analytics.send('fullscreen', 'enter')
    } else if (!document.fullscreenElement && fullscreen) {
      fullscreen = false
      Analytics.send('fullscreen', 'exit')
    }
  })
}

window.addEventListener('beforeunload', () => {
  Analytics.send('app', 'quit')
})

Object.assign(window, {
  BemuseTestMode,
})
