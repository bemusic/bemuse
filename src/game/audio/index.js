
import PlayerAudio from './player-audio'

export class GameAudio {
  constructor({ game, samples, master }) {
    this._players = new Map(game.players.map(player =>
      [player, new PlayerAudio({ player, samples, master })]))
    void samples
    void master
  }
  update(t) {
    for (let [player, audio] of this._players) {
      void player
      audio.update(t)
    }
  }
}

export default GameAudio
