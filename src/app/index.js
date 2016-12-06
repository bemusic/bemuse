import * as Analytics from './analytics'
import * as OptionsIO from './io/OptionsIO'
import * as ReduxState from './redux/ReduxState'

import now from 'bemuse/utils/now'
import workerPath from
  'bemuse/hacks/service-worker-url!serviceworker!./service-worker.js'
import React from 'react'
import SCENE_MANAGER from 'bemuse/scene-manager'
import { shouldShowAbout, shouldShowModeSelect }
    from 'bemuse/devtools/query-flags'
import { createIO, createRun } from 'impure'
import { withContext } from 'recompose'

import ioContext from './io/ioContext'
import store from './redux/instance'
import AboutScene from './ui/AboutScene'
import BrowserSupportWarningScene from './ui/BrowserSupportWarningScene'
import ModeSelectScene from './ui/ModeSelectScene'
import TitleScene from './ui/TitleScene'
import { WarpDestination } from '../react-warp'
import { isBrowserSupported } from './browser-support'
import { OFFICIAL_SERVER_URL } from './constants'
import { getMusicServer, getTimeSynchroServer, getInitialGrepString }
    from './query-flags'

export const runIO = createRun({
  context: ioContext
})

// HACK: Make SCENE_MANAGER provide Redux store and IO context.
SCENE_MANAGER.ReactSceneContainer = withContext(
  { store: React.PropTypes.object, runIO: React.PropTypes.func },
  () => ({ store, runIO })
)(({ children }) => {
  return <div className="bemuse-scene">
    {React.Children.only(children)}
    <WarpDestination />
  </div>
})

// Allow hot reloading of some modules.
if (module.hot) {
  module.hot.accept('./redux/ReduxState', () => { })
}

export default runIO

function bootUp () {
  return createIO(({ collectionLoader, store }, run) => {
    collectionLoader.load(getMusicServer() || OFFICIAL_SERVER_URL)
    store.dispatch({
      type: ReduxState.MUSIC_SEARCH_TEXT_INITIALIZED,
      text: getInitialGrepString()
    })
    run(OptionsIO.loadInitialOptions())
  })
}

export function main () {
  runIO(bootUp())

  // setup service worker
  let promise = setupServiceWorker()
  if (promise && promise.then) {
    Promise.resolve(promise).finally(displayFirstScene).done()
  } else {
    displayFirstScene()
  }

  // synchronize time
  let timeSynchroServer = (getTimeSynchroServer() ||
        'wss://timesynchro.herokuapp.com/')
  if (timeSynchroServer) now.synchronize(timeSynchroServer)

}

function displayFirstScene () {
  SCENE_MANAGER.display(getFirstScene()).done()
}

function getFirstScene () {
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

function shouldActivateServiceWorker () {
  return (
    (location.protocol === 'https:' && location.host === 'bemuse.ninja') ||
    (location.hostname === 'localhost')
  )
}

function setupServiceWorker () {
  if (!('serviceWorker' in navigator)) return false
  if (!shouldActivateServiceWorker()) return false
  registerServiceWorker()
  return true
}

function registerServiceWorker () {
  const url = '/sw-loader.js?path=' + encodeURIComponent(workerPath)
  return navigator.serviceWorker.register(url)
}

window.addEventListener('beforeunload', () => {
  Analytics.send('app', 'quit')
})
