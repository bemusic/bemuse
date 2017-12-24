import { load } from './loader'
import { Context } from './context'

export { load, Context }

export function getSkinUrl () {
  if (window.innerWidth < window.innerHeight) {
    return '/skins/default/skin_touch.xml'
  } else {
    return '/skins/default/skin_screen.xml'
  }
}
