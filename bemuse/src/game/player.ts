import Notechart from 'bemuse-notechart'
import { PlayerOptions } from 'bemuse-notechart/lib/types'

export type PlayerControlKeys =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | 'SC'
  | 'SC2'

export type PlayerOptionsPlacement = 'left' | 'center' | 'right' | '3d'

export type PlayerOptionsScratch = 'left' | 'right' | 'off'

export type PlayerOptionsGauge = 'off' | 'hope'

type PlayerOptionsInputMapping = {
  keyboard: { [control in PlayerControlKeys]: string }
  continuous: boolean
  sensitivity: number
}

type PlayerOptionsInternal = {
  autoplayEnabled: boolean
  autosound: boolean
  speed: number
  placement: PlayerOptionsPlacement
  scratch: PlayerOptionsScratch
  laneCover: number
  gauge: PlayerOptionsGauge
  input: PlayerOptionsInputMapping
  tutorial: boolean
}

export type PlayerOptionsInput = PlayerOptions & {
  autoplayEnabled?: boolean
  autosound?: boolean
  speed: number
  placement?: PlayerOptionsPlacement
  laneCover?: number
  gauge: PlayerOptionsGauge
  input: PlayerOptionsInputMapping
  tutorial?: boolean
}

/** The object representing the player's information, notechart and options. */
export class Player {
  public readonly options: PlayerOptionsInternal
  constructor(
    public readonly notechart: Notechart,
    public readonly number: number,
    options: PlayerOptionsInput
  ) {
    this.options = {
      autoplayEnabled: !!options.autoplayEnabled,
      autosound: !!options.autosound,
      speed: +options.speed,
      placement: options.placement || 'center',
      scratch: options.scratch || 'left',
      input: options.input,
      laneCover: +(options.laneCover || 0),
      gauge: options.gauge,
      tutorial: !!options.tutorial,
    }
  }

  // An array of column names for this Notechart.
  get columns() {
    return this.notechart.columns
  }
}

export default Player
