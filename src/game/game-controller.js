
export class GameController {
  constructor({ game, display, audio }) {
    this._game    = game
    this._display = display
    this._audio   = audio
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
    if (this._started) return
    this._display.start()
    let frame = () => {
      this._update()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }
  _update() {
    this._display.update()
  }
}

export default GameController
