
import View from 'bemuse/view!./view.jade'
import './style.scss'

export default function LoadingScene({ loader, song }) {
  function getData() {
    return {
      song,
      items: loader.tasks.map(({ text, progressText, progress }) => ({
        text:     text,
        progress: progressText ? ` (${progressText})` : '',
        width:    Math.round((progress * 100) || 0) + '%',
      })),
    }
  }
  return function(container) {
    let data = getData()
    let view = new View({ el: container, data })
    loader.on('progress', () => view.set(getData()))
    return function() {
      container.classList.add('is-exiting')
      return Promise.delay(500)
    }
  }
}
