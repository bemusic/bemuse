
import GameTimer from './game-timer'
import GameState from './state'
import GameInput from './input'
import Clock     from './clock'

import TouchPlugin from './input/touch-plugin'


function Benchmarker() {
  var stats = { }
  var sum = { }
  var count = { }
  var now = window.performance ?
        () => window.performance.now() :
        () => Date.now()
  return {
    stats,
    benchmark(title, obj, name) {
      let old = obj[name]
      obj[name] = function() {
        try {
          var start = now()
          return old.apply(this, arguments)
        } finally {
          var finish = now()
          sum[title] = (sum[title] || 0) + finish - start
          count[title] = (count[title] || 0) + 1
          stats[title] = sum[title] / count[title]
        }
      }
    },
  }
}

export class GameController {
  constructor({ game, display, audio }) {
    this._game    = game
    this._display = display
    this._audio   = audio
    this._clock   = new Clock(this._audio)
    this._timer   = new GameTimer(this._clock)
    this._input   = new GameInput()
    this._state   = new GameState(game)
    this._input.use(new TouchPlugin(this._display.context))
    this.enableBenchmark()
  }
  get game() {
    return this._game
  }
  get display() {
    return this._display
  }
  get audio() {
    return this._audio
  }
  start() {
    this._display.start()
    let frame = () => {
      this._update()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }
  _update() {
    this._clock.update()
    let t = this._timer.time
    let A = 0.0
    this._input.update()
    this._state.update(t - A, this._input)
    this._audio.update(t,     this._state)
    this._display.update(t,   this._state)
  }
  enableBenchmark() {
    let bench = window.GAME_BENCHMARK = this._bench = new Benchmarker()
    bench.benchmark('input_update', this._input, 'update')
    bench.benchmark('state_update', this._state, 'update')
    bench.benchmark('audio_update', this._audio, 'update')
    bench.benchmark('display_update', this._display, 'update')
    bench.benchmark('display_push',
        this._display._context._instance, 'push')
    bench.benchmark('display_render',
        this._display._context._renderer, 'render')
    let button = document.createElement('button')
    button.innerHTML = 'Show Benchmark Stats'
    button.addEventListener('click', function() {
      alert('Benchmarking Result\n' + JSON.stringify(bench.stats, null, 2))
    })
    button.setAttribute('style',
        'position:fixed;top:10px;right:10px;z-index:99999')
    document.body.appendChild(button)
  }
}

export default GameController
