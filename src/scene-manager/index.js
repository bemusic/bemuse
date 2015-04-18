
import co from 'co'

// The SceneManager takes care of managing the scenes in this game.
// Only a single scene may be displayed at any given time, but a scene may
// contain any number of UI elements.
//
// Programmatically, a scene is defined like this::
//
//    var scene = function onEnter(container) {
//      // container :: HTMLElement
//      // add DOM elements to container
//      return {
//        teardown() {
//          return new Promise(function(resolve) {
//            // when the scene finish exiting, call resolve()
//          })
//        }
//      }
//    }
//
// To use the SceneManager, get the instance and use it::
//
//    import SCENEMAN from 'bemuse/scene-manager'
//    SCENEMAN.display(scene)
//
export class SceneManager {
  constructor() {
  }

  // Displays the scene and returns a promise that resolves when the old
  // scene finishes exiting.
  display(scene) {
    return co(function*() {
      if (this.currentScene) {
        yield Promise.resolve(this.currentScene.teardown())
        detach(this.currentElement)
      }
      var element = document.createElement('div')
      element.className = 'scene'
      document.body.appendChild(element)
      this.currentElement = element
      this.currentScene = scene(element)
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
