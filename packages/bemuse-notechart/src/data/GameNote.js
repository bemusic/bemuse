
import DataStructure  from 'data-structure'
import GameEvent      from './GameEvent'

export let GameNote = new DataStructure(GameEvent, {
  id:         Number,
  end:        DataStructure.maybe(GameEvent),
  column:     String,
})

export default GameNote
