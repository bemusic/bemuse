
import { notechart } from './spec_helper'

describe('Notechart', function() {

  describe('.fromBMSChart', function() {
    it('should work', function() {
      var subject = notechart('#00116:01\n#00101:02')
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

  describe('scratch off', function() {
    it('should move scratch to autokeysounds', function() {
      var subject = notechart('#00116:01\n#00101:02', { scratch: 'off' })
      expect(subject.notes).to.have.length(0)
      expect(subject.autos).to.have.length(2)
    })
  })

  describe('5K', function() {
    const src = `
      #00116:01
      #00111:01
      #00112:01
      #00113:01
      #00114:01
      #00115:01
    `
    function byColumn(column) {
      return note => note.column === column
    }
    describe('scratch left', function() {
      it('should keep notes intact', function() {
        var subject = notechart(src, { scratch: 'left' })
        expect(subject.notes).to.have.length(6)
        void expect(subject.notes.filter(byColumn('1'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('2'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('3'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('4'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('5'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('6'))).to.be.empty
        void expect(subject.notes.filter(byColumn('7'))).to.be.empty
      })
    })
    describe('scratch off', function() {
      it('should shift columns by 1', function() {
        var subject = notechart(src, { scratch: 'off' })
        expect(subject.notes).to.have.length(5)
        void expect(subject.notes.filter(byColumn('6'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('1'))).to.be.empty
      })
    })
    describe('scratch right', function() {
      it('should shift columns by 2', function() {
        var subject = notechart(src, { scratch: 'right' })
        expect(subject.notes).to.have.length(6)
        void expect(subject.notes.filter(byColumn('6'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('7'))).not.to.be.empty
        void expect(subject.notes.filter(byColumn('1'))).to.be.empty
        void expect(subject.notes.filter(byColumn('2'))).to.be.empty
      })
    })
  })

  describe('#samples', function() {
    it('should return an array of all used samples', function() {
      var subject = notechart('#WAV0X wow.wav\n#00101:0x0x')
      expect(subject.samples).to.deep.equal(['wow.wav'])
    })
  })

  describe('#duration', function() {
    it('should return the duration of notechart', function() {
      var subject = notechart('#00111:0101')
      expect(subject.duration).to.equal(6)
    })
    it('should work with long notes', function() {
      var subject = notechart('#00151:0101')
      expect(subject.duration).to.equal(6)
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

  describe('#barLines', function() {
    it('should return the list of beat with barlines', function() {
      var subject = notechart('#00111:0001\n#00102:0.75')
      expect(subject.barLines).to.deep.equal([
        { beat: 0, position: 0 },
        { beat: 4, position: 4 },
        { beat: 7, position: 7 },
      ])
    })
    it('should consider long notes', function() {
      var subject = notechart('#00151:0001\n#00251:0001')
      expect(subject.barLines).to.deep.equal([
        { beat: 0, position: 0 },
        { beat: 4, position: 4 },
        { beat: 8, position: 8 },
        { beat: 12, position: 12 },
      ])
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
