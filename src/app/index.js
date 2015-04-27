
import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import MusicSelectScene from './ui/music-select-scene.jsx'

import { getMusicServer } from './query-flags'

import * as CollectionActions from './actions/collection-actions'

export function main() {
  CollectionActions.loadCollection(getMusicServer() || '/music')
  SCENE_MANAGER.display(React.createElement(MusicSelectScene)).done()
}
