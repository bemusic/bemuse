
import SCENE_MANAGER from 'bemuse/scene-manager'
import LoadingScene from './loading-scene'

export function main() {
  SCENE_MANAGER.display(new LoadingScene())
}
