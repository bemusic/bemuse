
import R from 'ramda'

export class Animation {
}

export function _parse($el) {
  let keyframes = R.map(_attrs, Array.from($el.children('keyframe')))
  let attrs = { }
  for (let keyframe of keyframes) {
    let time = +keyframe.t
    let ease = keyframe.ease || 'linear'
    if (isNaN(time)) throw new Error('Expected keyframe to have "t" attribute')
    for (let key in keyframe) {
      if (key === 't' || key === 'ease') continue
      let value = +keyframe[key]
      let attr = attrs[key] || (attrs[key] = _createKeyframes(key))
      attr.keyframes.push({ time, value, ease })
    }
  }
  return R.values(attrs)
}

function _createKeyframes(name) {
  return { name, keyframes: [] }
}

export function _attrs(el) {
  return R.fromPairs(R.map(n => [n.name.toLowerCase(), n.value], el.attributes))
}

export default Animation
