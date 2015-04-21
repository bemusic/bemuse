
import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import MusicSelectScene from './ui/music-select-scene.jsx'

export function main() {
  SCENE_MANAGER.display(<MusicSelectScene />).done()
}

// React is implicitly used in JSX syntax. We do this to shut up Eslint.
void React
