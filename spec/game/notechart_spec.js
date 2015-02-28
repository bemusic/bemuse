
import BMS from 'bms'
import Notechart from 'bemuse/game/notechart'

function chart(code) {
  return BMS.Compiler.compile(code).chart
}

function notechart(code) {
  return Notechart.fromBMSChart(chart(code), 1, { })
}

describe('Notechart', function() {

  describe('.fromBMSChart', function() {
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

  describe('#samples', function() {
    it('should return an array of all used samples', function() {
      var subject = notechart('#WAV0X wow.wav\n#00101:0x0x')
      expect(subject.samples).to.deep.equal(['wow.wav'])
    })
  })

  describe('#secondsToBeat', function() {
    it('should convert seconds to beat', function() {
      var subject = notechart('#BPM 120')
      expect(subject.secondsToBeat(1)).to.equal(2)
    })
  })

  describe('#secondsToPosition', function() {
    it('should convert seconds to position', function() {
      var subject = notechart('#BPM 120')
      expect(subject.secondsToPosition(1)).to.equal(2)
    })
  })

})
