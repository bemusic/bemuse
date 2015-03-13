
import NoteArea from 'bemuse/game/display/note-area'

describe('NoteArea', function() {

  it('allows querying the visible note from a list of notes', function() {
    let notes = [
      { position: 1, column: 'A' },
      { position: 2, column: 'A' },
      { position: 3, column: 'A' },
      { position: 4, column: 'A' },
      { position: 5, column: 'A' },
      { position: 6, column: 'A' },
      { position: 10, end: { position: 12 }, column: 'B' },
      { position: 11, column: 'C' },
    ]
    let area = new NoteArea(notes)
    expect(area.getVisibleNotes(1.5, 3.5)).to.have.length(2)
    expect(area.getVisibleNotes(-1, 7)).to.have.length(6)
    expect(area.getVisibleNotes(8, 10.1)).to.have.length(1)
    expect(area.getVisibleNotes(8, 10.1)).to.have.length(1)
    expect(area.getVisibleNotes(8, 14)).to.have.length(2)
    expect(area.getVisibleNotes(11.5, 14)).to.have.length(1)
    expect(area.getVisibleNotes(12.5, 14)).to.have.length(0)
  })

})

