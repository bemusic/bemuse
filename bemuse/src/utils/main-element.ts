import { createRoot } from 'react-dom/client'

const sceneRootElement = document.querySelector('#scene-root')

if (!sceneRootElement) {
  throw new Error('The scene root element `#scene-root` not found')
}

export const sceneRoot = createRoot(sceneRootElement)

export default sceneRootElement
