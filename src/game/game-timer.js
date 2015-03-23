
// The game timer keeps track of song progression in-game.
// This class should be tied to the AudioContext.
//
export class GameTimer {
  constructor(clock) {
    this._clock = clock
    this._started = this._clock.time
  }
  get time() {
    return this._clock.time - this._started
  }
}

export default GameTimer
