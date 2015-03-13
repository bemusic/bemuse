
import BMS from 'bms'
import Notechart from 'bemuse/game/notechart'

export function chart(code) {
  if (code === undefined) code = ''
  return BMS.Compiler.compile(code).chart
}

export function notechart(code) {
  return Notechart.fromBMSChart(chart(code))
}

