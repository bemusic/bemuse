import _ from 'lodash'
import $ from 'jquery'
import keytime from 'keytime'

const createKeytime = (def) => Object.assign({}, def, { data: keytime(def.data) })

export class Animation {
  constructor(animations, timeKey) {
    this._timeKey = timeKey || 't'
    this._properties = _(animations)
      .map((animation) => _.map(animation.data, 'name'))
      .flatten()
      .thru((array) => new Set(array))
      .value()
    this._animations = _.map(animations, createKeytime)
    this._events = _.uniq(_.map(animations, 'on'))
  }

  prop(name, fallback) {
    if (!this._properties.has(name)) {
      return fallback
    }
    return (data) => {
      const values = this._getAnimation(data)
      if (values.hasOwnProperty(name)) {
        return values[name]
      } else {
        return fallback(data)
      }
    }
  }

  _getAnimation(data) {
    const event = _(this._events)
      .filter((e) => e === '' || e in data)
      .maxBy((e) => data[e] || 0)
    const t = data[this._timeKey] - (data[event] || 0)
    const animations = this._animations.filter((a) => a.on === event)
    const values = animations.map((a) => a.data.values(t))
    return Object.assign({}, ...values)
  }

  static compile(compiler, $el) {
    const animationElements = Array.from($el.children('animation'))
    const animations = _.map(animationElements, (el) => _compile($(el)))
    const timeKey = $el.attr('t') || 't'
    return new Animation(animations, timeKey)
  }
}

export function _compile($el) {
  const keyframes = _.map(Array.from($el.children('keyframe')), _attrs)
  const attrs = {}
  for (const keyframe of keyframes) {
    const time = +keyframe.t
    const ease = keyframe.ease || 'linear'
    if (isNaN(time)) throw new Error('Expected keyframe to have "t" attribute')
    for (const key in keyframe) {
      if (key === 't' || key === 'ease') continue
      const value = +keyframe[key]
      const attr = attrs[key] || (attrs[key] = _createKeyframes(key))
      attr.keyframes.push({ time, value, ease })
    }
  }
  return {
    on: $el.attr('on') || '',
    data: _.values(attrs),
  }
}

function _createKeyframes(name) {
  return { name, keyframes: [] }
}

export function _attrs(el) {
  return _(el.attributes)
    .map((n) => [n.name.toLowerCase(), n.value])
    .fromPairs()
    .value()
}

export default Animation
