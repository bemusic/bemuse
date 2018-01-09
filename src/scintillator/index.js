import { Context } from './context'
import { load } from './loader'

export { load, Context }

export function getSkinUrl () {
  if (window.innerWidth < window.innerHeight) {
    return '/skins/default/skin_touch.xml'
  } else {
    return '/skins/default/skin_touch3d.xml'
    // return '/skins/default/skin_screen.xml'
  }
}
