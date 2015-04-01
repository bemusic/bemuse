
// The game timer keeps track of song progression in-game.
// This class should be tied to the AudioContext.
//
export class GameTimer {
  constructor(clock, input) {
    this._clock = clock
    this._input = input
    this.startTime = null
  }

  // True if the game is started, false otherwise.
  get started() {
    return this.startTime !== null
  }

  // Updates the timer. This method should be called once in the game loop.
  update() {
    this._checkStartGame()
    // The time, in seconds, since the start of the game.
    this.time = this._calculateTime()
  }

  _checkStartGame() {
    if (!this.started && this._input.get('start').value) {
      this.startTime = this._clock.time
    }
  }

  _calculateTime() {
    if (this.startTime === null) {
      return -0.5
    } else {
      var delta = this._clock.time - this.startTime
      if (delta < 1) {
        return 0.5 * delta * delta - 0.5
      } else {
        return delta - 1
      }
    }
  }

}

export default GameTimer
