
import { notechart } from './spec_helper'

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

  describe('#keysounds', function() {
    it('should return an object of all keysounds', function() {
      var subject = notechart(
            '#WAV0X wow.wav\n' +
            '#WAV0Y wow.wav\n' +
            '#WAV0Z foon.wav\n' +
            '#00101:0x0x0y0y0Z0Z')
      expect(subject.keysounds).to.deep.equal({
        '0x': 'wow.wav',
        '0y': 'wow.wav',
        '0z': 'foon.wav',
      })
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

  describe('#columns', function() {
    it('should return columns in notechart', function() {
      var subject = notechart('#00111:11')
      expect(subject.columns)
          .to.deep.equal(['SC', '1', '2', '3', '4', '5', '6', '7'])
    })
  })

  describe('#info', function() {
    it('normal note should have 1 combo', function() {
      var subject = notechart('#00111:11')
      expect(subject.info(subject.notes[0]).combos).to.equal(1)
    })
    it('long note should have 2 combos', function() {
      var subject = notechart('#00151:1111')
      expect(subject.info(subject.notes[0]).combos).to.equal(2)
    })
  })

})

