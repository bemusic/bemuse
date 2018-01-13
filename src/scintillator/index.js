import { Context } from './context'
import { load } from './loader'

export { load, Context }

export function getSkinUrl ({ displayMode } = {}) {
  if (displayMode === 'touch3d') {
    return '/skins/default/skin_touch3d.xml'
  } else {
    if (window.innerWidth < window.innerHeight) {
      return '/skins/default/skin_touch.xml'
    } else {
      return '/skins/default/skin_screen.xml'
    }
  }
}
