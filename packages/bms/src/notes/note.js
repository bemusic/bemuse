import DataStructure from 'data-structure'

export const Note = new DataStructure({
  beat: 'number',
  endBeat: DataStructure.maybe('number'),
  column: DataStructure.maybe('string'),
  keysound: 'string'
})
