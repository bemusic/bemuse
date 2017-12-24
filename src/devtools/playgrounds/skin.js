
import * as Scintillator from 'bemuse/scintillator'

import co from 'co'
import $ from 'jquery'

import BMS from 'bms'
import Game from 'bemuse/game/game'
import Notechart from 'bemuse-notechart'
import GameState from 'bemuse/game/state'
import GameInput from 'bemuse/game/input'
import GameDisplay from 'bemuse/game/display'
import MAIN from 'bemuse/utils/main-element'

export function main () {
  co(function * () {
    let chart = BMS.Compiler.compile(`
      #TITLE ทดสอบ Bemuse
      #ARTIST ฟหกด
      #00111:01
      #00112:01
      #00113:01
      #00114:01
      #00115:01
      #00118:01
      #00119:01
      #00116:01
      #00151:0001010000000000
      #00152:0001010000000000
      #00153:0001010000000000
      #00154:0001010000000000
      #00155:0001010000000000
      #00158:0001010000000000
      #00159:0001010000000000
      #00156:0001010000000000`).chart

    let notecharts = [
      Notechart.fromBMSChart(chart)
    ]

    let game = new Game(notecharts, {
      players: [{ speed: 2 }]
    })

    let skin = yield Scintillator.load(Scintillator.getSkinUrl())
    let context = new Scintillator.Context(skin)
    let display = new GameDisplay({ game, skin, context })
    let state = new GameState(game)
    let input = new GameInput()
    let started = new Date().getTime()
    let timer = {
      started: true,
      startTime: started,
      readyFraction: 0
    }

    display.start()
    display._getData = (getData => function () {
      let result = getData.apply(display, arguments)
      result['p1_score'] = (new Date().getTime() - started) % 555556
      console.log(result)
      return result
    })(display._getData)
    let draw = () => {
      let t = (new Date().getTime() - started) / 1000
      timer.time = t
      state.update(t, input, timer)
      display.update(t, state)
    }
    draw()
    requestAnimationFrame(function f () {
      draw()
      requestAnimationFrame(f)
    })
    showCanvas(context.view)
  })
    .done()
}

function showCanvas (view) {
  var { width, height } = view

  view.style.display = 'block'
  view.style.margin = '0 auto'

  MAIN.appendChild(view)
  resize()
  $(window).on('resize', resize)

  function resize () {
    var scale = Math.min(
      window.innerWidth / width,
      window.innerHeight / height
    )
    view.style.width = Math.round(width * scale) + 'px'
    view.style.height = Math.round(height * scale) + 'px'
  }
}
