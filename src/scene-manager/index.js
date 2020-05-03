import React from 'react'
import ReactDOM from 'react-dom'
import MAIN from 'bemuse/utils/main-element'

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
// Behind the scene, are using some advanced techniques which requires
// the scene class to be declared using ``React.createClass`` (not by extending
// ``React.Component``)
//
// To use the SceneManager, get the instance and use it::
//
//    import SCENE_MANAGER from 'bemuse/scene-manager'
//    import TitleScene from './TitleScene'
//    SCENE_MANAGER.display(<TitleScene />)
//
// Non-React Scene
//   You can also use a scene that is not React-based. Define your scene
//   as a function that accepts an HTMLElement and returns an object with a
//   ``teardown()`` method.
//
export class SceneManager {
  constructor() {
    this._transitioning = false
    this._stack = []
  }

  // Displays the scene and returns a promise that resolves when the old
  // scene finishes exiting.
  display(scene) {
    return this._transitionTo(() => {
      return scene
    })
  }

  // Displays the scene, while remembering the previous scene.
  push(scene) {
    let previousScene = this.currentScene
    return this._transitionTo(() => {
      this._stack.push(previousScene)
      return scene
    })
  }

  // Displays the previous scene.
  pop() {
    return this._transitionTo(() => {
      return this._stack.pop()
    })
  }

  async _transitionTo(getNextScene) {
    if (this._transitioning) throw new Error('Scene is transitioning!')
    try {
      this._transitioning = true

      // detach the previous scene
      if (this.currentSceneInstance) {
        await Promise.resolve(this.currentSceneInstance.teardown())
        detach(this.currentElement)
      }

      // obtain the next scene
      let scene = getNextScene()

      // coerce react elements
      if (typeof scene !== 'function') {
        scene = new ReactScene(scene, this.ReactSceneContainer)
      }

      // set up the next scene
      var element = document.createElement('div')
      element.className = 'scene-manager--scene'
      MAIN.appendChild(element)
      this.currentElement = element
      this.currentScene = scene
      this.currentSceneInstance = scene(element)
    } finally {
      this._transitioning = false
    }
  }
}

function detach(element) {
  if (element && element.parentNode === MAIN) {
    MAIN.removeChild(element)
  }
}

// The shared SceneManager instance.
export let instance = new SceneManager()

export default instance

function ReactScene(element, ReactSceneContainer) {
  return function instantiate(container) {
    let teardown = () => {}
    const clonedElement = React.cloneElement(element, {
      scene: element,
      registerTeardownCallback: callback => {
        teardown = callback
      },
    })
    const elementToDisplay = ReactSceneContainer ? (
      <ReactSceneContainer>{clonedElement}</ReactSceneContainer>
    ) : (
      clonedElement
    )
    ReactDOM.render(elementToDisplay, container)
    return {
      teardown() {
        return Promise.try(() => {
          return teardown()
        }).finally(() => {
          ReactDOM.unmountComponentAtNode(container)
        })
      },
    }
  }
}
