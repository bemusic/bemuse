
export class Player {
  constructor(notechart, playerNumber, options) {
    this._notechart = notechart
    this._number    = playerNumber
    void options
  }
  get columns() {
    return this._notechart.columns
  }
  get notechart() {
    return this._notechart
  }
  get number() {
    return this._number
  }
}

export default Player
