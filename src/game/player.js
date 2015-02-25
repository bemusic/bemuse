
export class Player {
  constructor(notechart, playerNumber, options) {
    this._notechart = notechart
    this._number    = playerNumber
    void playerNumber
    void options
  }
  get notechart() {
    return this._notechart
  }
  get number() {
    return this._number
  }
}

export default Player
