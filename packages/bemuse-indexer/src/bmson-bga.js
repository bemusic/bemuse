import * as bmson from 'bmson'

export function getBmsonBga (object, options) {
  if (!object.bga) return undefined
  if (!object.bga.bga_events) return undefined
  if (!object.bga.bga_header) return undefined
  if (!object.bga.bga_header.length) return undefined
  if (object.bga.bga_events.length !== 1) return undefined

  var mapping = {}
  object.bga.bga_header.forEach(function (bgaHeader) {
    mapping[bgaHeader.id] = bgaHeader.name
  })

  var event = object.bga.bga_events[0]
  var file = mapping[event.id]
  if (!file) return undefined

  var timing = options.timing
  var beatForPulse = bmson.beatForPulseForBmson(object)
  var offset = timing.beatToSeconds(beatForPulse(event.y))
  return { file: file, offset: offset }
}
