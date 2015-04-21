
import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import MusicSelectScene from './ui/music-select-scene.jsx'

export function main() {
  SCENE_MANAGER.display(React.createElement(MusicSelectScene)).done()
}
