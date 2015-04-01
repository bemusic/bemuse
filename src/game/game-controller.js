
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

// The GameController takes care of communications between each game
// component, and takes care of the Game loop.
export class GameController {
  constructor({ game, display, audio }) {
    this._audioInputLatency = game.options.audioInputLatency
    this._game    = game
    this._display = display
    this._audio   = audio
    this._clock   = new Clock(this._audio)
    this._input   = new GameInput()
    this._timer   = new GameTimer(this._clock, this._input)
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

  // Initializes the game components and kickstarts the game loop.
  start() {
    this._display.start()
    if (/Mobile.*?Safari/.test(navigator.userAgent)) {
      setInterval(() => this._update(), 10)
    } else {
      let frame = () => {
        this._update()
        requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }
  }

  _update() {
    // >> game/loop
    //
    // Turn-Based Update Cycle
    // -----------------------
    // At each iteration of the game loop, each game component takes turn and
    // update itself.  Each game component involved in this game loop should
    // have a ``update(...)`` method, which takes care of updating itself.
    // This is the only time the component will be mutable.
    //
    // Outside of the ``update`` method, a component should behave like an
    // immutable object.  This allows us to have some sense of immutability
    // without having to create new objects. See `the case for immutability`_.
    //
    // .. _the case for immutability: https://github.com/facebook/immutable-js/blob/d8d189ae7ea8965fee2ecc7320ebdc55e83eb6a1/README.md#the-case-for-immutability
    //
    // At each cycle, the following happens:
    //
    // - the Clock is updated to get the high-accuracy time
    // - the Timer is updated to get the in-game time
    // - the Input is updated to get button presses
    // - the State is updated to react to button presses -- judging notes and
    //   updating scores
    // - the Audio is updated to emit sound based on the updated state
    // - the Display is updated to render the game display based on the updated
    //   state
    //
    this._clock.update()
    this._input.update()
    this._timer.update()
    let t = this._timer.time
    let A = this._audioInputLatency
    this._state.update(t - A, this._input, this._timer)
    this._audio.update(t,     this._state)
    this._display.update(t,   this._state)
  }

  enableBenchmark() {
    let bench = window.GAME_BENCHMARK = this._bench = new Benchmarker()
    bench.benchmark('update', this, '_update')
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
    button.addEventListener('click', handler)
    button.addEventListener('touchstart', handler)
    button.setAttribute('style',
        'position:fixed;top:10px;right:10px;z-index:99999')
    document.body.appendChild(button)
    function handler(e) {
      alert('Benchmarking Result\n' + JSON.stringify(bench.stats, null, 2))
      e.preventDefault()
    }
  }

}

export default GameController
