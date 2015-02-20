
var Compiler  = require('../compiler')
var Notes     = require('../notes')

describe('Notes', function() {

  it('should be able to parse normal notes', function() {
    var chart = Compiler.compile('#00111:01020300').chart
    var notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(3)
  })

  it('should be able to parse autokeysounds', function() {
    var chart = Compiler.compile('#00101:01020300').chart
    var notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(3)
  })

})

