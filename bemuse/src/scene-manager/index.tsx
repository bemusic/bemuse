import React, { ReactNode } from 'react'

import { AppState } from 'bemuse/app/redux/ReduxState'
import MAIN from 'bemuse/utils/main-element'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { Store } from 'redux'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { enableMapSet } from 'immer'

enableMapSet()

const ReactSceneContainer = ({
  store,
  children,
}: {
  store: ToolkitStore<AppState>
  children: ReactNode
}) => (
  <div className='bemuse-scene'>
    <Provider store={store}>{React.Children.only(children)}</Provider>
  </div>
)

export interface ReactSceneInstance {
  teardown: () => Promise<void>
}

export type ReactScene = (
  container: Element,
  controller: SceneManager
) => ReactSceneInstance

export class SceneManager {
  private transitioning = false
  private stack: ReactScene[] = []

  currentScene: ReactScene | undefined
  currentElement: Element | undefined
  currentSceneInstance: ReactSceneInstance | undefined

  constructor(private readonly store: Store<AppState>) {}

  // Displays the scene and returns a promise that resolves when the old
  // scene finishes exiting.
  display(scene: ReactScene | JSX.Element) {
    return this.transitionTo(() => {
      return scene
    })
  }

  // Displays the scene, while remembering the previous scene.
  push(scene: ReactScene | JSX.Element) {
    const previousScene = this.currentScene
    return this.transitionTo(() => {
      if (previousScene) {
        this.stack.push(previousScene)
      }
      return scene
    })
  }

  // Displays the previous scene.
  pop() {
    return this.transitionTo(() => {
      return this.stack.pop()!
    })
  }

  private async transitionTo(getNextScene: () => ReactScene | JSX.Element) {
    if (this.transitioning) throw new Error('Scene is transitioning!')
    try {
      this.transitioning = true

      // detach the previous scene
      if (this.currentSceneInstance) {
        await Promise.resolve(this.currentSceneInstance.teardown())
        detach(this.currentElement)
      }

      // obtain the next scene
      let scene = getNextScene()

      // coerce react elements
      if (typeof scene !== 'function') {
        scene = ReactScene(scene, this.store)
      }

      // set up the next scene
      const element = document.createElement('div')
      element.className = 'scene-manager--scene'
      MAIN?.appendChild(element)
      this.currentElement = element
      this.currentScene = scene
      this.currentSceneInstance = scene(element, this)
    } finally {
      this.transitioning = false
    }
  }
}

function detach(element?: Element) {
  if (element && element.parentNode === MAIN) {
    MAIN?.removeChild(element)
  }
}

function ReactScene(
  element: JSX.Element,
  store: ToolkitStore<AppState>
): ReactScene {
  return function instantiate(container: Element) {
    let teardown = () => {}
    const clonedElement = React.cloneElement(element, {
      scene: element,
      registerTeardownCallback: (callback: () => void) => {
        teardown = callback
      },
    })
    const elementToDisplay = (
      <ReactSceneContainer store={store}>{clonedElement}</ReactSceneContainer>
    )
    ReactDOM.render(elementToDisplay, container)
    return {
      async teardown() {
        try {
          return teardown()
        } finally {
          ReactDOM.unmountComponentAtNode(container)
        }
      },
    }
  }
}
