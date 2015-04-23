
import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import MusicSelectScene from './ui/music-select-scene.jsx'

import * as CollectionActions from './actions/collection-actions'

export function main() {
  CollectionActions.loadCollection('/music')
  SCENE_MANAGER.display(React.createElement(MusicSelectScene)).done()
}
