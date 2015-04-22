
import co     from 'co'
import React  from 'react'

// The SceneManager takes care of managing the scenes in this game.
// Only a single scene may be displayed at any given time, but a scene may
// contain any number of UI elements.
//
// A scene is a React component that renders a ``<Scene>``::
//
//    export default React.createClass({
//      render() {
//        return <Scene>contents</Scene>
//      }
//    })
//
// To use the SceneManager, get the instance and use it::
//
//    import SCENE_MANAGER from 'bemuse/scene-manager'
//    import TitleScene from './title-scene'
//    SCENE_MANAGER.display(<TitleScene />)
//
// Non-React Scene
//   You can also use a scene that is not React-based. Define your scene
//   as a function that accepts an HTMLElement and returns an object with a
//   ``teardown()`` method.
//
export class SceneManager {
  constructor() {
  }

  // Displays the scene and returns a promise that resolves when the old
  // scene finishes exiting.
  display(scene) {
    if (typeof scene !== 'function') scene = new ReactScene(scene)
    return co(function*() {
      if (this.currentScene) {
        yield Promise.resolve(this.currentScene.teardown())
        detach(this.currentElement)
      }
      var element = document.createElement('div')
      element.className = 'scene-manager--scene'
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

function ReactScene(element) {
  return function instantiate(container) {
    let component = React.render(element, container)
    return {
      teardown() {
        if (component.teardown) return component.teardown()
      }
    }
  }
}
