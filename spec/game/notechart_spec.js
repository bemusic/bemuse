
import BMS from 'bms'
import Notechart from 'bemuse/game/notechart'

function chart(code) {
  return BMS.Compiler.compile(code).chart
}

function notechart(code) {
  return Notechart.fromBMSChart(chart(code), 1, { })
}

describe('Notechart', function() {

  describe('#fromBMSChart', function() {
    it('should work', function() {
      var subject = notechart('#00111:01\n#00101:02')
      expect(subject.notes).to.have.length(1)
      expect(subject.autos).to.have.length(1)
      expect(subject.notes[0].beat).to.equal(4)
    })
    it('should work with long notes', function() {
      var subject = notechart('#00151:0101')
      expect(subject.notes).to.have.length(1)
      expect(subject.notes[0].beat).to.equal(4)
      expect(subject.notes[0].end.beat).to.equal(6)
    })
  })

})
