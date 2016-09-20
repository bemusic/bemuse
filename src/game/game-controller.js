import bench from 'bemuse/devtools/benchmark'

import Clock from './clock'
import GameInput from './input'
import GameState from './state'
import GameTimer from './game-timer'
import OmniInputPlugin from './input/omni-input-plugin'
import TouchPlugin from './input/touch-plugin'

// The GameController takes care of communications between each game
// component, and takes care of the Game loop.
export class GameController {
  constructor ({ game, display, audio }) {
    this._audioInputLatency = game.options.audioInputLatency
    this._game    = game
    this._display = display
    this._audio   = audio
    this._clock   = new Clock(this._audio)
    this._input   = new GameInput()
    this._timer   = new GameTimer(this._clock, this._input)
    this._state   = new GameState(game)
    this._promise = new Promise(resolve => (this._resolvePromise = resolve))
    if (bench.enabled) this.enableBenchmark()
  }
  get game () {
    return this._game
  }
  get display () {
    return this._display
  }
  get audio () {
    return this._audio
  }
  get promise () {
    return this._promise
  }

  // Initializes the game components and kickstarts the game loop.
  start () {
    this._handleEscape()
    this._display.start()
    this._input.use(new OmniInputPlugin(this._game))
    this._input.use(new TouchPlugin(this._display.context))
    let stopped = false
    let frame = () => {
      if (stopped) return
      this._update()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
    this._endGameLoop = () => (stopped = true)
  }

  // Exits the game when escape is pressed.
  _handleEscape () {
    let onKeyDown = (e) => {
      const ESCAPE_KEY = 27
      const F1_KEY = 112
      if (e.keyCode === ESCAPE_KEY) {
        e.preventDefault()
        e.stopPropagation()
        this._resolvePromise({ state: this._state, replay: false })
      } else if (e.keyCode === F1_KEY) {
        e.preventDefault()
        e.stopPropagation()
        this._resolvePromise({ state: this._state, replay: true })
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    this._promise.finally(function () {
      window.removeEventListener('keydown', onKeyDown, true)
    }).done()
  }

  // Destroy the game.
  destroy () {
    this._endGameLoop()
    this._audio.destroy()
    this._input.destroy()
    this._display.destroy()
  }

  _update () {
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
    if (this._state.finished && this._resolvePromise) {
      this._resolvePromise({ state: this._state })
      this._resolvePromise = null
    }
  }

  enableBenchmark () {
    bench.benchmark('update', this, '_update')
    bench.benchmark('input_update', this._input, 'update')
    bench.benchmark('state_update', this._state, 'update')
    bench.benchmark('audio_update', this._audio, 'update')
    bench.benchmark('display_update', this._display, 'update')
    bench.benchmark('display_compute', this._display, '_getData')
    bench.benchmark('display_push',
        this._display._context._instance, 'push')
    bench.benchmark('display_render',
        this._display._context._renderer, 'render')
  }

}

export default GameController
