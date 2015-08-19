
import BMS        from 'bms'
import Notechart  from 'bemuse/game/notechart'
import Player     from 'bemuse/game/player'
import _          from 'lodash'

export let tap = _.tap

export function chart(code='') {
  return BMS.Compiler.compile(code).chart
}

export function notechart(code, options={}) {
  return Notechart.fromBMSChart(chart(code), options)
}

export function playerWithBMS(code, options={}) {
  return new Player(notechart(code, options), 1, options)
}
