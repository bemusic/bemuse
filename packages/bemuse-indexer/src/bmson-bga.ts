import * as bmson from 'bmson'
import * as BMS from 'bms'
import { BGAInfo } from './types'

export function getBmsonBga(
  object: bmson.Bmson,
  options: { timing: BMS.Timing }
): BGAInfo | undefined {
  if (!object.bga) return undefined
  if (!object.bga.bga_events) return undefined
  if (!object.bga.bga_header) return undefined
  if (!object.bga.bga_header.length) return undefined
  if (object.bga.bga_events.length !== 1) return undefined

  var mapping: { [id: string]: string } = {}
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
