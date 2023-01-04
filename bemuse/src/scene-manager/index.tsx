import React, { ReactNode, createContext } from 'react'
import { Root, createRoot } from 'react-dom/client'

import MAIN from 'bemuse/utils/main-element'

export type TeardownCallback = () => PromiseLike<void> | void

export type ReactScene = (container: Element, root: Root) => ReactSceneInstance

export interface ReactSceneInstance {
  teardown: TeardownCallback
}

export type SceneContainer = (props: { children: ReactNode }) => JSX.Element

export class SceneManager {
  constructor(private readonly ReactSceneContainer: SceneContainer) {}

  transitioning = false
  stack: ReactScene[] = []
  current:
    | {
        scene: ReactScene
        instance: ReactSceneInstance
        root: Root
      }
    | undefined

  display(scene: ReactScene | JSX.Element) {
    return this.transitionTo(scene)
  }

  push(scene: ReactScene | JSX.Element) {
    if (this.current) {
      this.stack.push(this.current.scene)
    }
    return this.transitionTo(scene)
  }

  async pop() {
    const last = this.stack.pop()
    if (last) {
      await this.transitionTo(last)
    }
  }

  private async transitionTo(sceneOrElement: ReactScene | JSX.Element) {
    if (this.transitioning) throw new Error('Scene is transitioning!')
    try {
      this.transitioning = true

      // detach the previous scene
      if (this.current) {
        await Promise.resolve(this.current.instance.teardown())
        this.current.root.unmount()
      }

      // coerce react elements
      const scene =
        typeof sceneOrElement === 'function'
          ? sceneOrElement
          : ReactScene(sceneOrElement, this.ReactSceneContainer)

      // set up the next scene
      const element = document.createElement('div')
      element.className = 'scene-manager--scene'
      MAIN?.appendChild(element)
      const sceneRoot = createRoot(element)
      const instance = scene(element, sceneRoot)
      this.current = {
        scene,
        instance,
        root: sceneRoot,
      }
    } finally {
      this.transitioning = false
    }
  }
}

function ReactScene(
  scene: JSX.Element,
  ReactSceneContainer: SceneContainer
): ReactScene {
  return function instantiate(_element, root) {
    let teardown: TeardownCallback = async () => {}
    const clonedElement = React.cloneElement(scene, {
      registerTeardownCallback: (callback: TeardownCallback) => {
        teardown = callback
      },
    })
    root.render(<ReactSceneContainer>{clonedElement}</ReactSceneContainer>)
    return {
      async teardown() {
        try {
          return await teardown()
        } finally {
          root.unmount()
        }
      },
    }
  }
}

export const SceneManagerContext = createContext<SceneManager>(
  // `defaultValue` should be `undefined` because there is no way to create it.
  undefined as unknown as SceneManager
)
