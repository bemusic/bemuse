
import SCENE_MANAGER from 'bemuse/scene-manager'
import LoadingScene from './loading-scene'
import GameLoader from './game-loader'

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
  let loader = new GameLoader()
  let promise = loader.load('/music/[aoi]olivia/olivia_SPpp.bml')
  SCENE_MANAGER.display(new LoadingScene({ loader, song }))
  promise.then(function() {
    SCENE_MANAGER.display(null)
  })
  .done()
}
