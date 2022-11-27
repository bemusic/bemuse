import PropTypes from 'prop-types'
import React from 'react'
import SCENE_MANAGER from 'bemuse/scene-manager'
import now from 'bemuse/utils/now'
import { OFFICIAL_SERVER_URL } from 'bemuse/music-collection'
import { createIO, createRun } from 'impure'
import {
  getDefaultCustomFolderContext,
  getSongsFromCustomFolders,
} from 'bemuse/custom-folder'
import { monetize } from 'monetizer'
import {
  shouldShowAbout,
  shouldShowModeSelect,
} from 'bemuse/devtools/query-flags'
import { withContext } from 'recompose'

import * as Analytics from './analytics'
import * as BemuseTestMode from '../devtools/BemuseTestMode'
import * as OptionsIO from './io/OptionsIO'
import * as ReduxState from './redux/ReduxState'
import AboutScene from './ui/AboutScene'
import BrowserSupportWarningScene from './ui/BrowserSupportWarningScene'
import ModeSelectScene from './ui/ModeSelectScene'
import TitleScene from './ui/TitleScene'
import ioContext from './io/ioContext'
import store from './redux/instance'
import {
  getInitialGrepString,
  getMusicServer,
  getTimeSynchroServer,
} from './query-flags'
import { isBrowserSupported } from './browser-support'

/* eslint import/no-webpack-loader-syntax: off */
export const runIO = createRun({
  context: ioContext,
})

// HACK: Make SCENE_MANAGER provide Redux store and IO context.
SCENE_MANAGER.ReactSceneContainer = withContext(
  { store: PropTypes.object, runIO: PropTypes.func },
  () => ({ store, runIO })
)(({ children }) => {
  return <div className='bemuse-scene'>{React.Children.only(children)}</div>
})

// Allow hot reloading of some modules.
if (module.hot) {
  module.hot.accept('./redux/ReduxState', () => {})
}

export default runIO

function bootUp() {
  return createIO(({ collectionLoader, store }, run) => {
    collectionLoader.load(getMusicServer() || OFFICIAL_SERVER_URL)
    store.dispatch({
      type: ReduxState.MUSIC_SEARCH_TEXT_INITIALIZED,
      text: getInitialGrepString(),
    })
    run(OptionsIO.loadInitialOptions())

    getSongsFromCustomFolders(getDefaultCustomFolderContext()).then((songs) => {
      if (songs.length > 0) {
        store.dispatch({
          type: ReduxState.CUSTOM_SONGS_LOADED,
          songs,
        })
      }
    })
  })
}

export function main() {
  runIO(bootUp())

  // setup service worker
  const promise = setupServiceWorker()
  if (promise && promise.then) {
    Promise.resolve(promise).finally(displayFirstScene)
  } else {
    displayFirstScene()
  }

  // synchronize time
  const timeSynchroServer =
    getTimeSynchroServer() || 'wss://timesynchro.herokuapp.com/'
  if (timeSynchroServer) now.synchronize(timeSynchroServer)

  trackFullscreenEvents()

  // add web monetization meta tag
  monetize('$twitter.xrptipbot.com/bemusegame')
}

function displayFirstScene() {
  SCENE_MANAGER.display(getFirstScene())
}

function getFirstScene() {
  if (shouldShowAbout()) {
    return React.createElement(AboutScene)
  } else if (shouldShowModeSelect()) {
    return React.createElement(ModeSelectScene)
  } else {
    let scene = React.createElement(TitleScene)
    if (!isBrowserSupported()) {
      scene = React.createElement(BrowserSupportWarningScene, { next: scene })
    }
    return scene
  }
}

function shouldActivateServiceWorker() {
  return (
    (location.protocol === 'https:' && location.host === 'bemuse.ninja') ||
    location.hostname === 'localhost'
  )
}

function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) return false
  if (!shouldActivateServiceWorker()) return false
  registerServiceWorker()
  return true
}

function registerServiceWorker() {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
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
