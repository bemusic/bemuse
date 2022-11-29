import * as Analytics from './analytics'
import * as BemuseTestMode from '../devtools/BemuseTestMode'

import {
  AppState,
  collectionsSlice,
  customSongsSlice,
} from './redux/ReduxState'
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
import React from 'react'
import { SceneManager } from 'bemuse/scene-manager'
import { Store } from 'redux'
import TitleScene from './ui/TitleScene'
import { isBrowserSupported } from './browser-support'
import { monetize } from 'monetizer'
import { musicSearchTextSlice } from './entities/MusicSearchText'
import now from 'bemuse/utils/now'
import { optionsSlice } from './entities/Options'

// Allow hot reloading of some modules.
if (module.hot) {
  module.hot.accept('./redux/ReduxState', () => {})
}

function bootUp(store: Store<AppState>) {
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
  store.dispatch(optionsSlice.actions.LOAD_FROM_STORAGE())

  getSongsFromCustomFolders(getDefaultCustomFolderContext()).then((songs) => {
    if (songs.length > 0) {
      store.dispatch(customSongsSlice.actions.CUSTOM_SONGS_LOADED({ songs }))
    }
  })
}

export function main({
  sceneManager,
  store,
}: {
  sceneManager: SceneManager
  store: Store<AppState>
}) {
  bootUp(store)
  displayFirstScene(sceneManager)

  // synchronize time
  const timeSynchroServer =
    getTimeSynchroServer() || 'wss://timesynchro.herokuapp.com/'
  if (timeSynchroServer) now.synchronize(timeSynchroServer)

  trackFullscreenEvents()

  // add web monetization meta tag
  monetize('$twitter.xrptipbot.com/bemusegame')
}

function displayFirstScene(sceneManager: SceneManager) {
  sceneManager.display(getFirstScene(sceneManager))
}

function getFirstScene(sceneManager: SceneManager) {
  if (shouldShowAbout()) {
    return <AboutScene sceneManager={sceneManager} />
  }
  if (shouldShowModeSelect()) {
    return <ModeSelectScene sceneManager={sceneManager} />
  }
  const scene = <TitleScene sceneManager={sceneManager} />
  if (!isBrowserSupported()) {
    return (
      <BrowserSupportWarningScene sceneManager={sceneManager} next={scene} />
    )
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
