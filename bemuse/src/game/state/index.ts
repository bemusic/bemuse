import PlayerState from './player-state'
import Game from '../game'
import Player from '../player'
import GameInput from '../input'
import GameTimer from '../game-timer'
import invariant from 'invariant'

export class GameState {
  /** See Timer#readyFraction. We need it here so that the display can read this information. */
  public readyFraction = 0
  /** True if the the player is getting started (i.e. holding down the start button for the first time), false otherwise. */
  public gettingStarted = false
  /** True if the game is started, false otherwise. */
  public started = false
  /** True if the game is finished, false otherwise. */
  public finished = false

  private _players: Map<Player, PlayerState>

  constructor(public readonly game: Game) {
    this._players = new Map(
      game.players.map((player) => [player, new PlayerState(player)])
    )
  }
  update(gameTime: number, input: GameInput, timer: GameTimer) {
    let finished = true
    for (let [player, playerState] of this._players) {
      playerState.update(gameTime, input)
      if (!playerState.finished) finished = false
      void player
    }
    this.readyFraction = timer.readyFraction
    this.gettingStarted = timer.gettingStarted
    this.started = timer.started
    this.finished = finished
  }
  player(p: Player) {
    const playerState = this._players.get(p)
    return (
      playerState ||
      invariant(
        false,
        'Invariant violation: No player state found for player %s',
        p.number
      )
    )
  }
}

export default GameState
