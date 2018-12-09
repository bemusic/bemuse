import DataStructure from 'data-structure'

/** A single note in a notechart. */
export interface BMSNote {
  beat: number
  endBeat?: number
  column?: string
  keysound: string
}

export const Note = DataStructure<BMSNote>({
  beat: 'number',
  endBeat: DataStructure.maybe<number>('number'),
  column: DataStructure.maybe<string>('string'),
  keysound: 'string',
})
