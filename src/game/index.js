import co from 'co'

import SCENE_MANAGER from 'bemuse/scene-manager'
import LoadingScene from './loading-scene'
import GameLoader from './game-loader'
import GameScene from './game-scene'

import URLResource from 'bemuse/resources/url'
import BemusePackageResources from 'bemuse/resources/bemuse-package'

export function main() {
  let song = {
        title: 'オリヴィアの幻術',
        subtitles: [
          '[Tonalite]',
        ],
        artist: '葵',
        genre: 'Sexy Dance',
        subartists: [
          'mov:いとう まさき/obj:止ヒ糸',
        ],
      }
  co(function*() {
    let loader = new GameLoader()
    let promise = loader.load({
      bms:    new URLResource('/music/[aoi]olivia/olivia_SPpp.bml'),
      assets: new BemusePackageResources('/music/[aoi]olivia/assets/'),
    })
    SCENE_MANAGER.display(new LoadingScene({ loader, song }))
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()
  })
  .done()
}
