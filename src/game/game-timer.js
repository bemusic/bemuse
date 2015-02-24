
// The game timer keeps track of song progression in-game.
// This class should be tied to the AudioContext.
//
export class GameTimer {
  constructor() {
    this._started = new Date().getTime()
  }
  get time() {
    return (new Date().getTime() - this._started) / 1000
  }
}

export default GameTimer
