import assert from 'power-assert'
import * as bmson from '../src'

/* global describe, it */
describe('bmson v1.0.0', function() {
  describe('songInfoForBmson', function() {
    it('should return a song info', function() {
      const info = bmson.songInfoForBmson({
        version: '1.0.0',
        info: {
          title: 'Reminiscentia',
          artist: 'flicknote',
          genre: 'Dramatic Trance',
          init_bpm: 160,
        },
      })
      assert(info.title === 'Reminiscentia')
      assert(info.artist === 'flicknote')
      assert(info.genre === 'Dramatic Trance')
    })
    it('should put chart_name into subtitles field', function() {
      const info = bmson.songInfoForBmson({
        version: '1.0.0',
        info: {
          chart_name: 'FOUR DIMENSIONS',
        },
      })
      assert.deepEqual(info.subtitles, ['FOUR DIMENSIONS'])
    })
    it('should put each line of subtitle into subtitles field', function() {
      const info = bmson.songInfoForBmson({
        version: '1.0.0',
        info: {
          subtitle: 'First Episode\nreturn of the cat meow',
        },
      })
      assert.deepEqual(info.subtitles, [
        'First Episode',
        'return of the cat meow',
      ])
    })
    it('should skip blank chart names and subtitle', function() {
      const info = bmson.songInfoForBmson({
        version: '1.0.0',
        info: {
          subtitle: '',
          chart_name: '',
        },
      })
      assert.deepEqual(info.subtitles, [])
    })
    it('should have subartists', function() {
      const info = bmson.songInfoForBmson({
        version: '1.0.0',
        info: {
          title: 'Running Out 2015',
          subartists: ['music:flicknote', 'bga:5argon'],
        },
      })
      assert.deepEqual(info.subartists, ['music:flicknote', 'bga:5argon'])
    })
  })

  describe('barLinesForBmson', function() {
    it('should return barlines in beat', function() {
      const beats = bmson.barLinesForBmson({
        version: '1.0.0',
        info: {
          resolution: 3,
        },
        lines: [{ y: 0 }, { y: 12 }, { y: 24 }],
      })
      assert.deepEqual(beats, [0, 4, 8])
    })
  })

  describe('timingInfoForBmson', function() {
    it('should return timing of initial bpm', function() {
      let { initialBPM } = bmson.timingInfoForBmson({
        version: '1.0.0',
        info: {
          init_bpm: 180,
        },
      })
      assert(initialBPM === 180)
    })

    it('supports BPM changes', function() {
      let { initialBPM, actions } = bmson.timingInfoForBmson({
        version: '1.0.0',
        info: { init_bpm: 120 },
        bpm_events: [{ y: 2880, bpm: 196 }],
      })
      assert(initialBPM === 120)
      assert.deepEqual(actions, [{ type: 'bpm', beat: 12, bpm: 196 }])
    })

    it('supports stops', function() {
      let { initialBPM, actions } = bmson.timingInfoForBmson({
        version: '1.0.0',
        info: { init_bpm: 120, resolution: 8 },
        stop_events: [{ y: 96, duration: 42 }],
      })
      assert(initialBPM === 120)
      assert.deepEqual(actions, [{ type: 'stop', beat: 12, stopBeats: 42 / 8 }])
    })
  })

  describe('musicalScoreForBmson', function() {
    function setup(notes) {
      let data = {
        version: '1.0.0',
        info: {
          init_bpm: 100,
          resolution: 24,
        },
        sound_channels: [
          {
            name: 'piano.wav',
            notes: notes,
          },
        ],
      }
      return bmson.musicalScoreForBmson(data)
    }

    it('returns a timing', function() {
      const score = setup([])
      assert(typeof score.timing.beatToSeconds === 'function')
      assert(score.timing.beatToSeconds(1) === 60 / 100)
    })

    it('generates keysounds and notes', function() {
      let score = setup([{ x: 1, y: 24, l: 0, c: false }])
      assert.deepEqual(score.notes.all(), [
        {
          column: '1',
          beat: 1,
          endBeat: void 0,
          keysound: '0001',
          keysoundStart: 0,
          keysoundEnd: void 0,
        },
      ])
      assert(score.keysounds.get('0001') === 'piano.wav')
    })

    it('handles long notes', function() {
      let score = setup([{ x: 1, y: 24, l: 48, c: false }])
      assert.deepEqual(score.notes.all(), [
        {
          column: '1',
          beat: 1,
          endBeat: 3,
          keysound: '0001',
          keysoundStart: 0,
          keysoundEnd: void 0,
        },
      ])
    })

    it('handles keysound slices', function() {
      let score = setup([
        { x: 1, y: 24, l: 0, c: false },
        { x: 1, y: 48, l: 0, c: true },
      ])
      let notes = score.notes.all()
      assert(notes[0].keysoundStart === 0)
      assert(notes[0].keysoundEnd === 0.6)
      assert(notes[1].keysoundStart === 0.6)
      assert(notes[1].keysoundEnd === undefined)
    })
  })

  describe('hasScratch', function() {
    it('should return true if there is a scratch in 1P', function() {
      const data = {
        version: '1.0.0',
        sound_channels: [
          { notes: [{ x: 1 }] },
          { notes: [{ x: 3 }, { x: 8 }] },
        ],
      }
      assert(bmson.hasScratch(data))
    })
    it('should return true if there is a scratch in 2P', function() {
      const data = {
        version: '1.0.0',
        sound_channels: [
          { notes: [{ x: 1 }] },
          { notes: [{ x: 13 }, { x: 18 }] },
        ],
      }
      assert(bmson.hasScratch(data))
    })
    it('should return false if scratch not found', function() {
      const data = {
        version: '1.0.0',
        sound_channels: [
          { notes: [{ x: 1 }] },
          { notes: [{ x: 3 }, { x: 7 }] },
        ],
      }
      assert(!bmson.hasScratch(data))
    })
  })

  describe('keysForBmson', function() {
    function testcase(xs, keys) {
      it('should work with ' + keys, function() {
        const actual = bmson.keysForBmson({
          version: '1.0',
          sound_channels: xs.map(x => ({
            notes: [{ x }],
          })),
        })
        assert(actual === keys)
      })
    }
    testcase([1, 3, 5, 7], '7K')
    testcase([1, 3, 5, 8], '5K')
    testcase([1, 3, 5, 8, 12, 14, 18], '10K')
    testcase([1, 3, 5, 8, 12, 14, 16, 18], '14K')
    testcase([], 'empty')
  })
})
