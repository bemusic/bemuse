
import PlayerAudio from './player-audio'

export class GameAudio {
  constructor({ game, samples, master }) {
    this._master = master
    this._context = master.audioContext
    this._players = new Map(game.players.map(player =>
      [player, new PlayerAudio({ player, samples, master })]))
  }
  unmute() {
    this._master.unmute()
  }
  get context() {
    return this._context
  }
  update(t, state) {
    for (let [player, playerAudio] of this._players) {
      playerAudio.update(t, state.player(player))
    }
  }
}

export default GameAudio
