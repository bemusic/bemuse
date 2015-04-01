
// The game timer keeps track of song progression in-game.
// This class should be tied to the AudioContext.
//
export class GameTimer {
  constructor(clock) {
    this._clock = clock
    this._started = null
  }

  // The time, in seconds, since the start of the game.
  get time() {
    if (this._started === null) {
      return 0
    } else {
      return this._clock.time - this._started
    }
  }
}

export default GameTimer
