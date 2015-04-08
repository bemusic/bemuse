
import SCENE_MANAGER    from 'bemuse/scene-manager'
import MusicSelectScene from './music-select-scene'

export function main() {

  SCENE_MANAGER.display(new MusicSelectScene()).done()

}
