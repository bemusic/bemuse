
import 'bemuse/polyfill'
import co from 'co'

export class SceneManager {
  constructor() {
  }
  display(scene) {
    return co(function*() {
      if (this.exit) {
        yield Promise.resolve(this.exit())
        detach(this.currentElement)
      }
      var element = document.createElement('div')
      element.className = 'scene'
      document.body.appendChild(element)
      this.currentElement = element
      this.exit = scene(element)
    })
  }
}

function detach(element) {
  if (element && element.parentNode === document.body) {
    document.body.removeChild(element)
  }
}

export let instance = new SceneManager()
export default instance
