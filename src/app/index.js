
import now from 'bemuse/utils/now'

import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import TitleScene       from './ui/TitleScene'
import AboutScene       from './ui/AboutScene'
import ModeSelectScene  from './ui/ModeSelectScene'
import ServiceWorkerRegistrationScene
    from './ui/ServiceWorkerRegistrationScene'

import { OFFICIAL_SERVER_URL }    from './constants'
import { isBrowserSupported }     from './browser-support'
import BrowserSupportWarningScene from './ui/BrowserSupportWarningScene'

import { getMusicServer, getTimeSynchroServer }
    from './query-flags'
import { shouldShowAbout, shouldShowModeSelect }
    from 'bemuse/devtools/query-flags'

import workerPath from
  'bemuse/hacks/service-worker-url!serviceworker!./service-worker.js'
import { createIO, createRun } from 'impure'
import ioContext from './io/ioContext'
import { withContext } from 'recompose'
import store from './redux/instance'
import { WarpDestination } from '../react-warp'

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
  return createIO(({ collectionLoader }) => {
    collectionLoader.load(getMusicServer() || OFFICIAL_SERVER_URL)
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

function setupServiceWorker () {
  if (!('serviceWorker' in navigator)) return false
  if (location.host !== 'bemuse.dev' && location.host !== 'bemuse.ninja') {
    return false
  }
  if (location.protocol !== 'https:') return false
  if (navigator.serviceWorker.controller) {
    registerServiceWorker()
    return true
  } else {
    var cutscene = React.createElement(ServiceWorkerRegistrationScene)
    return SCENE_MANAGER.display(cutscene)
    .then(function () {
      return registerServiceWorker()
    })
    .then(function () {
      return new Promise(function () {
        location.reload()
      })
    })
  }
}

function registerServiceWorker () {
  return navigator.serviceWorker.register('/sw-loader.js?path=' +
    encodeURIComponent(workerPath))
}
