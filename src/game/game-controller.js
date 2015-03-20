
import GameTimer from './game-timer'
import GameState from './state'
import GameInput from './input'

export class GameController {
  constructor({ game, display, audio }) {
    this._game    = game
    this._display = display
    this._audio   = audio
    this._timer   = new GameTimer(this._audio)
    this._input   = new GameInput()
    this._state   = new GameState(game)
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
    let t = this._timer.time
    let A = 0.044
    this._input.update()
    this._state.update(t - A, this._input)
    this._audio.update(t,     this._state)
    this._display.update(t,   this._state)
  }
}

export default GameController
