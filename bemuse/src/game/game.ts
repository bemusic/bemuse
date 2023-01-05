import Player, { PlayerOptionsInput } from './player'
import Notechart from 'bemuse-notechart'

export type GamePlayerOptionsInput = {
  players: Omit<PlayerOptionsInput, 'autosound' | 'tutorial'>[]
  audioInputLatency: number
  tutorial?: boolean
  soundVolume?: number
}

/**
 * The Game model holds the game's options and the player objects.
 * This class represents all the data needed to start a game.
 * However, it is immutable.  See `GameState` for mutable stuff.
 */
export class Game {
  /** The Game's players */
  public players: Player[]

  constructor(
    notecharts: Notechart[],
    public readonly options: GamePlayerOptionsInput
  ) {
    this.players = options.players.map(function (playerOptions, index) {
      playerOptions = Object.assign({}, playerOptions, {
        autosound: options.audioInputLatency >= 0.01,
        tutorial: options.tutorial,
      })
      return new Player(notecharts[index], index + 1, playerOptions)
    })
  }

  /** A list of all sound samples used in game. Used for loading sounds. */
  get samples() {
    const set = new Set()
    for (const player of this.players) {
      for (const sample of player.notechart.samples) {
        set.add(sample)
      }
    }
    return Array.from(set)
  }
}

export default Game
