import * as BMS from 'bms'

export interface NotechartInput {
  notes: BMS.BMSNote[]
  timing: BMS.Timing
  keysounds: BMS.Keysounds
  songInfo: BMS.SongInfo
  positioning: BMS.Positioning
  spacing: BMS.Spacing

  /** Beats of bar lines */
  barLines: number[]

  /** Image references */
  images?: NotechartImages

  /**
   * For calculation of expert score (IIDX-esque EX-SCORE).
   * It should return a 2-tuple.
   *
   * 1. Maximum offset for +2 score (PGREAT).
   * 2. Maximum offset for +1 score (GREAT).
   */
  expertJudgmentWindow: ExpertJudgmentWindow
}

export type ExpertJudgmentWindow = [number, number]

export interface NotechartImages {
  eyecatch?: string
  background?: string
}

export interface PlayerOptions {
  scratch: 'off' | 'left' | 'right'
  double?: boolean
}

export interface GameEvent {
  beat: number
  time: number
  position: number
}

export interface SoundedEvent extends GameEvent {
  keysound: string
  keysoundStart?: number
  keysoundEnd?: number
}

export interface GameNote extends SoundedEvent {
  id: number
  end?: GameEvent
  column: string
}

export interface NoteInfo {
  /**
   * The maximum amount of judgments this note may give.
   * Usually it is 1 for normal notes and 2 for long notes.
   */
  combos: 2 | 1
}
