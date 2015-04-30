
import now from 'bemuse/utils/now'

import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import TitleScene       from './ui/title-scene'
import AboutScene       from './ui/about-scene'

import { isBrowserSupported }     from './browser-support'
import BrowserSupportWarningScene from './ui/browser-support-warning-scene'

import { getMusicServer, getTimeSynchroServer } from './query-flags'
import { shouldShowAbout } from 'bemuse/devtools/query-flags'

import * as CollectionActions from './actions/collection-actions'

export function main() {

  // load the music collection
  CollectionActions.loadCollection(getMusicServer() || '/music')

  // show the title scene
  SCENE_MANAGER.display(getFirstScene()).done()

  // synchronize time
  let timeSynchroServer = (getTimeSynchroServer() ||
        'wss://timesynchro.herokuapp.com/')
  if (timeSynchroServer) now.synchronize(timeSynchroServer)

}

function getFirstScene() {
  if (shouldShowAbout()) {
    return React.createElement(AboutScene)
  } else {
    let scene = React.createElement(TitleScene)
    if (!isBrowserSupported()) {
      scene = React.createElement(BrowserSupportWarningScene, { next: scene })
    }
    return scene
  }
}
