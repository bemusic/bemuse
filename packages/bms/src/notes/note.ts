import DataStructure from 'data-structure'

/**
 * @public
 */
export interface BMSNote {
  beat: number
  endBeat?: number
  column?: string
  keysound: string

  /**
   * [bmson] The number of seconds into the sound file to start playing
   */
  keysoundStart?: number

  /**
   * [bmson] The number of seconds into the sound file to stop playing.
   *
   * @remarks
   * This may be `undefined`, indicating that the sound file should play until the end.
   */
  keysoundEnd?: number
}

export const Note = DataStructure<BMSNote>({
  beat: 'number',
  endBeat: DataStructure.maybe<number>('number'),
  column: DataStructure.maybe<string>('string'),
  keysound: 'string',
})
