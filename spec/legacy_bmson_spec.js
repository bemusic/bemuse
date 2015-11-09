
import assert     from 'power-assert'
import { expect } from 'chai'
import BMS        from 'bms'

import * as bmson from '../index'

/* global describe, it */
describe('legacy bmson', function () {

  describe('songInfoForBmson', function () {
    it('should return a song info', function () {
      const info = bmson.songInfoForBmson({
        info: {
          title: 'Reminiscentia',
          artist: 'flicknote',
          genre: 'Dramatic Trance',
          initBPM: 160,
        }
      })
      assert(info.title === 'Reminiscentia')
      assert(info.artist === 'flicknote')
      assert(info.genre === 'Dramatic Trance')
    })
  })

  describe('barLinesForBmson', function () {

    it('should return barlines in beat', function () {
      const beats = bmson.barLinesForBmson({
        lines: [
          { y: 0, k: 0 },
          { y: 960, k: 0 },
          { y: 1920, k: 0 },
        ]
      })
      assert.deepEqual(beats, [0, 4, 8])
    })
  })

  describe('timingInfoForBmson', function () {

    it('should return timing of initial bpm', function () {
      let { initialBPM } = bmson.timingInfoForBmson({
        info: { initBPM: 180 }
      })
      assert(initialBPM === 180)
    })

    it('supports BPM changes', function () {
      let { initialBPM, actions } = bmson.timingInfoForBmson({
        info: { initBPM: 120 },
        bpmNotes: [
          { y: 2880, v: 196 }
        ]
      })
      assert(initialBPM === 120)
      assert.deepEqual(actions,
        [ { type: 'bpm', beat: 12, bpm: 196 } ]
      )
    })

    it('supports stops', function () {
      let { initialBPM, actions } = bmson.timingInfoForBmson({
        info: { initBPM: 120 },
        stopNotes: [
          { y: 2880, v: 196 }
        ]
      })
      assert(initialBPM === 120)
      assert.deepEqual(actions,
        [ { type: 'stop', beat: 12, stopBeats: 196 / 240 } ]
      )
    })
  })

  describe('musicalScoreForBmson', function () {
    function setup (notes) {
      let data = {
        info: {
          initBPM: 100,
        },
        soundChannel: [
          {
            name: 'piano.wav',
            notes: notes
          }
        ]
      }
      return bmson.musicalScoreForBmson(data)
    }

    it('returns a timing', function () {
      const score = setup([ ])
      assert(typeof score.timing.beatToSeconds === 'function')
    })

    it('generates keysounds and notes', function () {
      let score = setup([
        { x: 1, y: 240, l: 0, c: false }
      ])
      assert.deepEqual(score.notes.all(), [
        {
          column: '1', beat: 1, endBeat: undefined, keysound: '0001',
          keysoundStart: 0, keysoundEnd: undefined,
        }
      ])
      assert(score.keysounds.get('0001') === 'piano.wav')
    })

    it('handles long notes', function () {
      let score = setup([
        { x: 1, y: 240, l: 480, c: false }
      ])
      assert.deepEqual(score.notes.all(), [
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
      assert(notes[0].keysoundStart === 0)
      assert(notes[0].keysoundEnd === 0.6)
      assert(notes[1].keysoundStart === 0.6)
      assert(notes[1].keysoundEnd === undefined)
    })
  })

  describe('_slicesForNotesAndTiming (private)', function () {

    it('returns sound slices by y', function () {

      let timing = new BMS.Timing(100, [ ])

      let slices = bmson._slicesForNotesAndTiming([
        { x: 1, y: 240, l: 0, c: false },
        { x: 1, y: 480, l: 0, c: true },
        { x: 0, y: 720, l: 0, c: true },
        { x: 0, y: 960, l: 0, c: true },
        { x: 1, y: 1200, l: 0, c: true },
        { x: 1, y: 1440, l: 0, c: false },
        { x: 1, y: 1680, l: 0, c: true },
      ], timing)

      function check (y, start, end) {
        let slice = slices.get(y)
        assert(Math.abs(slice.keysoundStart - start) < 1e-6)
        if (end === undefined) {
          assert(slice.keysoundEnd === undefined)
        } else {
          assert(Math.abs(slice.keysoundEnd - end) < 1e-6)
        }
      }

      check(240, 0, 0.6)
      check(480, 0.6, 1.2)
      check(720, 1.2, 2.4)
      assert(slices.get(960) === undefined)
      check(1200, 2.4, undefined)
      check(1440, 0, 0.6)
      check(1680, 0.6, undefined)
    })
  })

  describe('hasScratch', function () {
    it('should return true if there is a scratch in 1P', function () {
      const data = {
        soundChannel: [
          { notes: [ { x: 1 } ] },
          { notes: [ { x: 3 }, { x: 8 } ] },
        ]
      }
      assert(bmson.hasScratch(data))
    })
    it('should return true if there is a scratch in 2P', function () {
      const data = {
        soundChannel: [
          { notes: [ { x: 1 } ] },
          { notes: [ { x: 13 }, { x: 18 } ] },
        ]
      }
      assert(bmson.hasScratch(data))
    })
    it('should return false if scratch not found', function () {
      const data = {
        soundChannel: [
          { notes: [ { x: 1 } ] },
          { notes: [ { x: 3 }, { x: 7 } ] },
        ]
      }
      assert(!bmson.hasScratch(data))
    })
  })

  describe('keysForBmson', function () {
    function testcase (xs, keys) {
      it('should work with ' + keys, function () {
        const actual = bmson.keysForBmson({
          soundChannel: xs.map(x => ({
            notes: [ { x } ]
          }))
        })
        expect(actual).to.equal(keys)
      })
    }
    testcase([1, 3, 5, 7], '7K')
    testcase([1, 3, 5, 8], '5K')
    testcase([1, 3, 5, 8, 12, 14, 18], '10K')
    testcase([1, 3, 5, 8, 12, 14, 16, 18], '14K')
    testcase([], 'empty')
  })
})
