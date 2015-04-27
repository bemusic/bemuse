
import now from 'bemuse/utils/now'

import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import MusicSelectScene from './ui/music-select-scene.jsx'

import { getMusicServer, getTimeSynchroServer } from './query-flags'

import * as CollectionActions from './actions/collection-actions'

export function main() {

  // load the music collection
  CollectionActions.loadCollection(getMusicServer() || '/music')

  // show the music select scene
  SCENE_MANAGER.display(React.createElement(MusicSelectScene)).done()

  // synchronize time
  let timeSynchroServer = getTimeSynchroServer()
  if (timeSynchroServer) now.synchronize(timeSynchroServer)

}
