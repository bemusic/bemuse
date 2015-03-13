
import PlayerState from './player-state'

export class GameState {
  constructor(game) {
    this._game    = game
    this._players = new Map(game.players.map(player =>
        [player, new PlayerState(player)]))
  }
  update(gameTime, input) {
    for (let [player, playerState] of this._players) {
      playerState.update(gameTime, input)
      void player
    }
  }
  player(p) {
    return this._players.get(p)
  }
}

export default GameState
