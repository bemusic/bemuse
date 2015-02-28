
import PlayerAudio from './player-audio'

export class GameAudio {
  constructor({ game, samples, master }) {
    this._players = new Map(game.players.map(player =>
      [player, new PlayerAudio({ controller: this, player })]))
    void samples
    void master
  }
}

export default GameAudio
