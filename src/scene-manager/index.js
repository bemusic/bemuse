
import 'bemuse/polyfill'
import co from 'co'

export class SceneManager {
  constructor() {
  }
  display(scene) {
    return co(function*() {
      if (this.currentScene) {
        yield Promise.resolve(this.currentScene.exit())
        detach(this.currentElement)
        yield Promise.resolve(this.currentScene.detached())
      }
      this.currentScene = scene
      this.currentElement = scene.element
      document.body.appendChild(this.currentElement)
      yield Promise.resolve(this.currentScene.attached())
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
