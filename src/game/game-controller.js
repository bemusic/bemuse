
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
    let t = this._timer.time
    this._display.update(t)
    this._audio.update(t)
  }
}

export default GameController
