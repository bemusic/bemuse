import * as Scintillator from 'bemuse/scintillator'
import $ from 'jquery'
import BMS from 'bms'
import Game from 'bemuse/game/game'
import GameDisplay from 'bemuse/game/display'
import GameInput from 'bemuse/game/input'
import GameState from 'bemuse/game/state'
import MAIN from 'bemuse/utils/main-element'
import { fromBMSChart } from 'bemuse-notechart/lib/loader/BMSNotechartLoader'

// TODO [#628]: Convert the `main` method to async function (instead of using `co`) in src/devtools/playgrounds/skin.js
// See issue #575 for more details.
export async function main() {
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
    #00156:0001010000000000
    #00211:010000000000000000010000
    #00212:000100000000000000010000
    #00213:010001000000000000010000
    #00214:010000010000000001000001
    #00215:010000000100000100000100
    #00218:010000000010010001000100
    #00219:010000000001000100000100`).chart

  let notecharts = [fromBMSChart(chart)]

  let game = new Game(notecharts, {
    players: [{ speed: 2 }],
  })

  let skin = await Scintillator.load(
    Scintillator.getSkinUrl({
      displayMode: 'touch3d',
    })
  )

  let context = new Scintillator.Context(skin)
  let display = new GameDisplay({ game, skin, context })
  let state = new GameState(game)
  let input = new GameInput()
  let started = new Date().getTime()
  let timer = {
    started: true,
    startTime: started,
    readyFraction: 0,
  }

  display.start()
  display._getData = (getData =>
    function() {
      let result = getData.apply(display, arguments)
      result['p1_score'] = (new Date().getTime() - started) % 555556
      window.LATEST_DATA = result
      return result
    })(display._getData)

  let draw = () => {
    let t = (new Date().getTime() - started) / 1000
    timer.time = t
    state.update(t, input, timer)
    display.update(t, state)
  }
  draw()
  requestAnimationFrame(function f() {
    draw()
    requestAnimationFrame(f)
  })

  showCanvas(context.view)
}

function showCanvas(view) {
  var { width, height } = view

  view.style.display = 'block'
  view.style.margin = '0 auto'

  MAIN.appendChild(view)
  resize()
  $(window).on('resize', resize)

  function resize() {
    var scale = Math.min(window.innerWidth / width, window.innerHeight / height)
    view.style.width = Math.round(width * scale) + 'px'
    view.style.height = Math.round(height * scale) + 'px'
  }
}
