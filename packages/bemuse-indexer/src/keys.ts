import * as BMS from 'bms'
import { Keys } from './types'

export function getKeys(chart: BMS.BMSChart): Keys {
  const objects = chart.objects.all()
  const stat: { [channel: number]: number } = {}
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    let channel = +object.channel
    if (channel >= 50 && channel <= 69) channel -= 40
    if (channel < 10) continue
    if (channel > 29) continue
    stat[channel] = (stat[channel] || 0) + 1
  }
  const channels = Object.keys(stat).map(function (ch) {
    return +ch
  })
  if (channels.length === 0) return 'empty'
  if (channels.some(isSecondPlayer)) {
    return stat[18] || stat[19] || stat[28] || stat[29] ? '14K' : '10K'
  }
  return stat[18] || stat[19] ? '7K' : '5K'

  function isSecondPlayer(ch: number) {
    return ch >= 20 && ch <= 29
  }
}
