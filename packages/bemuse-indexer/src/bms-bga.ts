import * as BMS from 'bms'
import { BGAInfo } from './types'

export function getBmsBga(
  chart: BMS.BMSChart,
  options: { timing: BMS.Timing }
): BGAInfo | undefined {
  const getFile = (object: BMS.BMSObject): string | undefined => {
    return chart.headers.get('bmp' + object.value)
  }
  const bgaObjects = chart.objects
    .all()
    .filter((o) => o.channel === '04' && isVideoFile(getFile(o)))
  if (bgaObjects.length === 0) return undefined
  const object = bgaObjects[0]
  const timing = options.timing
  const beat = chart.measureToBeat(object.measure, object.fraction)
  const offset = timing.beatToSeconds(beat)
  const file = getFile(object)
  if (!file) return undefined
  return { file, offset }
}

function isVideoFile(path: string | undefined): boolean {
  if (!path) return false
  return /\.(?:mpg|mpeg|avi|wmv|ogv|webm|ogm|mov|mp4|mkv|flv|m4v)$/i.test(path)
}
