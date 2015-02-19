
import Ractive from 'ractive'

export function View(template) {
  return function ViewInstance(options) {
    return new Ractive(Object.assign({ template }, options))
  }
}
