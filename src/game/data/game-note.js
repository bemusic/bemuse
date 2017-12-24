import DataStructure from 'data-structure'
import Event from './event'

export let GameNote = new DataStructure(Event, {
  id: Number,
  end: DataStructure.maybe(Event),
  column: String
})

export default GameNote
