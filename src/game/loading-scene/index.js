
import View from 'bemuse/view!./view.jade'
import './style.scss'

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
    let view = new View({ el: container, data })
    tasks.watch(() => view.set(getData()))
    return {
      teardown() {
        container.classList.add('is-exiting')
        return Promise.delay(500)
      }
    }
  }

}
