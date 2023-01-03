import { SceneManager } from '.'

export type ReactScene = (
  container: Element,
  controller: SceneManager
) => ReactSceneInstance

export interface ReactSceneInstance {
  teardown: () => Promise<void>
}
