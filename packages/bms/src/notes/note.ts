import DataStructure from 'data-structure'

/** A single note in a notechart. */
export interface BMSNote {
  beat: number
  endBeat?: number
  column?: string
  /**
   * The keysound ID, normalized to its canonical form for the chart’s base
   * (lowercased in base-36, case-preserved in base-62). This matches the keys
   * used by {Keysounds}, so it can be looked up directly.
   */
  keysound: string

  /**
   * [bmson] The number of seconds into the sound file to start playing
   */
  keysoundStart?: number

  /**
   * [bmson] The {Number} of seconds into the sound file to stop playing.
   * This may be `undefined` to indicate that the sound file should play until the end.
   */
  keysoundEnd?: number
}

export const Note = DataStructure<BMSNote>({
  beat: 'number',
  endBeat: DataStructure.maybe<number>('number'),
  column: DataStructure.maybe<string>('string'),
  keysound: 'string',
})
