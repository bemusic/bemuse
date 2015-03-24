
import View from 'bemuse/view!./view.jade'
import './style.scss'

export default function GameShellScene({ options, play }) {

  return function enter(container) {
    let view = new View({
      el: container,
      data: {
        options: options,
      },
    })
    view.on({
      submit: function(e) {
        play(view.get('options'))
        e.original.preventDefault()
      },
    })
    return function exit() {
    }
  }

}

