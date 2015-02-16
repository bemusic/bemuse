
import View from 'bemuse/view!./view.jade'
import './style.scss'

export default function LoadingScene() {
  return function(container) {
    new View({ el: container })
  }
}
