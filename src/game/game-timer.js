
import now from 'bemuse/utils/now'

// The game timer keeps track of song progression in-game.
// This class should be tied to the AudioContext.
//
export class GameTimer {
  constructor(clock, input) {
    this._clock = clock
    this._input = input
    this._now   = now.synchronized()
    this.startTime = null
    this.readyFraction = 0
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
    if (this.started) return
    if (this._input.get('start').value) {
      this.gettingStarted = true
    }
    if (this.gettingStarted && !this._input.get('start').value) {
      this.startTime = this._clock.time + this._getWait()
    }
    if (!this.started) {
      // The number in range 0...1 representing the progression in this second.
      // When player presses the "Start" button, the game will wait for the
      // next second before actually starting the game.
      // Since the clock is synchronized globally, if player presses start
      // in the same second, the game will start at the same time.
      //
      this.readyFraction = 1 - this._getWait()
    }
  }
  _getWait() {
    let t = this._now() / 1000
    return Math.ceil(t) - t
  }

  _calculateTime() {
    // When initializing the game, we suspend the timer at -0.333 seconds.
    // Then, when the player starts the game, we slowly accelerate such that
    // after 1 second, the timer approaches 0 seconds at normal speed.
    // This is accomplished using some magic formula ;).
    //
    var delta = this.startTime === null ? 0 : this._clock.time - this.startTime
    if (delta < 0) delta = 0
    if (delta < 1) {
      return (Math.pow(delta, 6) - 1) / 6 - 1 / 30
    } else {
      return delta - 31 / 30
    }
  }

}

export default GameTimer
