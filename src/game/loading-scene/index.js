
import View from 'bemuse/view!./view.jade'
import './style.scss'

export default function LoadingScene({ loader, song }) {
  function getData() {
    return {
      song,
      items: loader.tasks.map(task => ({
        text: task.text + (task.current && task.total ?
                ` (${task.current} / ${task.total})` : ''),
        width: Math.round((task.progress * 100) || 0) + '%',
      })),
    }
  }
  return function(container) {
    let data = getData()
    let view = new View({ el: container, data })
    loader.on('progress', () => { console.log('progress') })
    loader.on('progress', () => view.set(getData()))
  }
}
