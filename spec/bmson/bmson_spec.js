
import * as bmson from 'bemuse/bmson'
import BMS        from 'bms'

describe('bmson', function () {

  describe('getBarLines', function () {

    it('should return barlines in beat', function () {
      expect(bmson.getBarLines([
        { y: 0, k: 0 },
        { y: 960, k: 0 },
        { y: 1920, k: 0 },
      ])).to.deep.equal([0, 4, 8])
    })
  })

  describe('getTimingInfo', function () {

    it('should return timing of initial bpm', function () {
      let { initialBPM } = bmson.getTimingInfo({
        info: { initBPM: 180 }
      })
      expect(initialBPM).to.equal(180)
    })

    it('supports BPM changes')

    it('supports stops')
  })

  describe('getMusicalScore', function () {

    function setup(notes) {

      let timing = new BMS.Timing(100, [ ])

      let data = {
        soundChannel: [
          {
            name: 'piano.wav',
            notes: notes
          }
        ]
      }

      return bmson.getMusicalScore(data, timing)
    }

    it('generates keysounds and notes', function () {

      let score = setup([
        { x: 1, y: 240, l: 0, c: false }
      ])
      expect(score.notes.all()).to.deep.equal([
        {
          column: '1', beat: 1, endBeat: undefined, keysound: '0001',
          keysoundStart: 0, keysoundEnd: undefined,
        }
      ])
      expect(score.keysounds.get('0001')).to.equal('piano.wav')
    })

    it('handles long notes', function () {

      let score = setup([
        { x: 1, y: 240, l: 480, c: false }
      ])
      expect(score.notes.all()).to.deep.equal([
        {
          column: '1', beat: 1, endBeat: 3, keysound: '0001',
          keysoundStart: 0, keysoundEnd: undefined,
        }
      ])
    })

    it('handles keysound slices', function () {

      let score = setup([
        { x: 1, y: 240, l: 0, c: false },
        { x: 1, y: 480, l: 0, c: true },
      ])
      let notes = score.notes.all()
      expect(notes[0].keysoundStart).to.equal(0)
      expect(notes[0].keysoundEnd).to.equal(0.6)
      expect(notes[1].keysoundStart).to.equal(0.6)
      expect(notes[1].keysoundEnd).to.equal(undefined)
    })
  })

  describe('getSlices', function () {

    it('returns sound slices by y', function () {

      let timing = new BMS.Timing(100, [ ])

      let slices = bmson.getSlices([
        { x: 1, y: 240, l: 0, c: false },
        { x: 1, y: 480, l: 0, c: true },
        { x: 0, y: 720, l: 0, c: true },
        { x: 0, y: 960, l: 0, c: true },
        { x: 1, y: 1200, l: 0, c: true },
        { x: 1, y: 1440, l: 0, c: false },
        { x: 1, y: 1680, l: 0, c: true },
      ], timing)

      function check(y, start, end) {
        let slice = slices.get(y)
        expect(slice.keysoundStart).to.be.closeTo(start, 1e-6)
        if (end === undefined) {
          void expect(slice.keysoundEnd).to.be.undefined
        } else {
          expect(slice.keysoundEnd).to.be.closeTo(end, 1e-6)
        }
      }

      check(240, 0, 0.6)
      check(480, 0.6, 1.2)
      check(720, 1.2, 2.4)
      expect(slices.get(960)).to.equal(undefined)
      check(1200, 2.4, undefined)
      check(1440, 0, 0.6)
      check(1680, 0.6, undefined)
    })
  })
})
