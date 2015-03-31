
import 'bemuse/polyfill'
import co from 'co'

// The SceneManager takes care of the game scene.
// A scene is defined like this::
//
//    var scene = function onEnter(container) {
//      // container :: HTMLElement
//      // add DOM elements to container
//      return function onExit() {
//        return new Promise(function(resolve) {
//          // when the scene finish exiting, call resolve()
//        })
//      }
//    }
//
export class SceneManager {
  constructor() {
  }

  // Displays the scene and returns a promise that resolves when the old
  // scene finishes exiting.
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

// The shared SceneManager instance.
export let instance = new SceneManager()

export default instance
