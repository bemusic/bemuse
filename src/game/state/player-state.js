
export class PlayerState {
  constructor(player) {
    this._player = player
  }
  update(gameTime, input) {
    let prefix = `p${this._player.number}_`
    this.input = new Map(this._player.columns.map((column) =>
        [column, input.get(`${prefix}${column}`)]))
  }
}

export default PlayerState
