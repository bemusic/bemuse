
// The game timer keeps track of song progression in-game.
// This class should be tied to the AudioContext.
//
export class GameTimer {
  constructor(audio) {
    audio.unmute() // kick start the currentTime of audio context
    this._context = audio.context
    this._started = this._context.currentTime
  }
  get time() {
    return this._context.currentTime - this._started
  }
}

export default GameTimer
