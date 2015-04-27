
import PlayerState from './player-state'

export class GameState {
  constructor(game) {
    this._game    = game
    this._players = new Map(game.players.map(player =>
        [player, new PlayerState(player)]))
  }
  // The `Game` object associated with this `GameState`.
  get game() {
    return this._game
  }
  update(gameTime, input, timer) {
    let finished = true
    for (let [player, playerState] of this._players) {
      playerState.update(gameTime, input)
      if (!playerState.finished) finished = false
      void player
    }
    // See Timer#readyFraction.
    // We need it here so that the display can read this information.
    this.readyFraction = timer.readyFraction
    // True if the game is started, false otherwise.
    this.started = timer.started
    // True if the game is finished, false otherwise.
    this.finished = finished
  }
  player(p) {
    return this._players.get(p)
  }
}

export default GameState
