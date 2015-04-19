
import './loading-scene.scss'
import LoadingSceneTemplate from 'bemuse/view!./loading-scene.jade'

export default function LoadingScene({ tasks, song }) {

  function getData() {
    return {
      song,
      items: tasks.value.map(({ text, progressText, progress }) => ({
        text:     text,
        progress: progressText ? ` (${progressText})` : '',
        width:    Math.round((progress * 100) || 0) + '%',
      })),
    }
  }

  return function(container) {

    let data = getData()

    let view = new LoadingSceneTemplate({
      el:     container,
      data:   data,
      components: {
        Scene: require('bemuse/ui/scene'),
      },
    })

    tasks.watch(() => view.set(getData()))

    return {
      teardown() {
        view.find('.loading-scene').classList.add('is-exiting')
        return Promise.delay(500)
      }
    }

  }

}
