
import GameTimer from './game-timer'
import GameInput from './input'

export class GameController {
  constructor({ game, display, audio }) {
    this._game    = game
    this._display = display
    this._audio   = audio
    this._timer   = new GameTimer()
    this._input   = new GameInput()
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
    this._display.update(this._timer.time)
  }
}

export default GameController
