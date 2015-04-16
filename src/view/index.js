
import Ractive from 'ractive'

export function View(template) {
  return Ractive.extend({ template })
}
