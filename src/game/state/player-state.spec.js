import assert from 'power-assert'

import GameInput from '../input'
import Player from '../player'
import PlayerState from './player-state'
import { notechart } from '../test-helpers'

describe('PlayerState', function () {
  it('updates the input', function () {
    let state = new PlayerState({
      number: 1,
      columns: ['wow'],
      notechart: notechart(''),
      options: { speed: 1 }
    })
    let input = {
      get: name => ({ name })
    }
    state.update(0, input)
    assert(state.input.get('wow').name === 'p1_wow')
  })

  describe('with player and chart', function () {
    let chart
    let player
    let state
    let input
    let buttons

    function setup (bms, options = { speed: 1 }) {
      chart = notechart(bms)
      player = new Player(chart, 1, options)
      state = new PlayerState(player)
      input = new GameInput()
      buttons = { }
      input.use({ get: () => buttons })
    }

    function advance (time, b) {
      buttons = b
      input.update()
      state.update(time, input)
    }

    describe('node judging', function () {
      it('judges notes', function () {
        setup(`
          #BPM 120
          #00111:0101
        `)

        let column = chart.notes[0].column

        assert(state.getNoteStatus(chart.notes[0]) === 'unjudged')
        assert(state.stats.combo === 0)
        assert(state.stats.poor === false)
        assert(state.stats.totalCombo === 2)
        assert(!state.notifications.judgments)

        advance(1.999, { })
        assert(state.getNoteStatus(chart.notes[0]), 'unjudged')

        advance(2, { 'p1_1': 1 })
        assert(state.getNoteStatus(chart.notes[0]), 'judged')
        assert(state.getNoteJudgment(chart.notes[0]), 1)
        assert(state.getNoteStatus(chart.notes[1]), 'unjudged')
        assert.deepEqual(
          state.notifications.judgments[0],
          { judgment: 1, combo: 1, delta: 0, column }
        )
        assert(!state.stats.poor)

        advance(2.1, { 'p1_1': 0 })
        advance(5, { 'p1_1': 0 })
        assert(state.getNoteStatus(chart.notes[1]) === 'judged')
        assert(state.getNoteJudgment(chart.notes[1]) === -1)
        assert.deepEqual(
          state.notifications.judgments[0],
          { judgment: -1, combo: 0, delta: 2, column }
        )
        assert(state.stats.poor === true)
      })

      it('judges multiple notes in different column', function () {
        setup(`
          #BPM 120
          #00111:01
          #00112:01
        `)

        advance(2, { 'p1_1': 1, 'p1_2': 1 })
        assert(state.getNoteStatus(chart.notes[0]) === 'judged')
        assert(state.getNoteStatus(chart.notes[1]) === 'judged')
      })

      it('judges single note from one column at a time', function () {
        setup(`
          #BPM 480
          #00111:01010100000000000000000000000000
        `)

        advance(0.531, { 'p1_1': 1 })
        assert(state.getNoteStatus(chart.notes[0]) === 'judged')
        assert(state.getNoteStatus(chart.notes[1]) === 'unjudged')
        assert(state.getNoteStatus(chart.notes[2]) === 'unjudged')
        advance(0.531, { 'p1_1': 0 })
        advance(0.531, { 'p1_1': 1 })
        assert(state.getNoteStatus(chart.notes[0]) === 'judged')
        assert(state.getNoteStatus(chart.notes[1]) === 'judged')
        assert(state.getNoteStatus(chart.notes[2]) === 'unjudged')
        advance(0.531, { 'p1_1': 0 })
        advance(0.531, { 'p1_1': 1 })
        assert(state.getNoteStatus(chart.notes[0]) === 'judged')
        assert(state.getNoteStatus(chart.notes[1]) === 'judged')
        assert(state.getNoteStatus(chart.notes[2]) === 'judged')

        assert(state.getNoteJudgment(chart.notes[0]) > 1)
        assert(state.getNoteJudgment(chart.notes[1]) === 1)
        assert(state.getNoteJudgment(chart.notes[2]) > 1)
      })

      it('leaves note unjudged when bad and there are closer note', function () {
        setup(`
          #BPM 120
          #00111:01010100000000000000000000000000
        `)

        advance(2.125, { 'p1_1': 1 })
        assert(state.getNoteStatus(chart.notes[0]) === 'unjudged')
        assert(state.getNoteStatus(chart.notes[1]) === 'judged')
        assert(state.getNoteStatus(chart.notes[2]) === 'unjudged')
      })

      it('records delta when pressed', function () {
        setup(`
          #BPM 120
          #00111:01
        `)
        sinon.spy(state.stats, 'handleDelta')
        advance(2.01, { 'p1_1': 1 })
        assert(state.stats.handleDelta.calledWith(2.01 - 2))
      })

      it('does not record delta when missed', function () {
        setup(`
          #BPM 120
          #00111:01
        `)
        sinon.spy(state.stats, 'handleDelta')
        advance(9, { 'p1_1': 1 })
        assert(state.stats.handleDelta.callCount === 0)
      })

      describe('with long note', function () {
        let note
        beforeEach(function () {
          setup(`
            #BPM 120
            #00151:0101
          `)
          note = chart.notes[0]
        })
        it('judges long note', function () {
          advance(2, { 'p1_1': 1 })
          assert(state.getNoteStatus(note) === 'active')
          assert(state.getNoteJudgment(note) === 1)
          assert(state.notifications.judgments[0].judgment === 1)
          advance(3, { 'p1_1': 0 })
          assert(state.getNoteStatus(note) === 'judged')
          assert(state.getNoteJudgment(note) === 1)
          assert(state.notifications.judgments[0].judgment === 1)
        })
        it('gives 2 discrete judgments, one for down and one for up', function () {
          advance(2, { 'p1_1': 1 })
          assert(state.stats.numJudgments === 1)
          advance(3, { 'p1_1': 0 })
          assert(state.stats.numJudgments === 2)
        })
        it('records delta once', function () {
          sinon.spy(state.stats, 'handleDelta')
          advance(2, { 'p1_1': 1 })
          advance(3, { 'p1_1': 0 })
          assert(state.stats.handleDelta.callCount === 1)
        })
        it('judges missed long note', function () {
          advance(2.3, { 'p1_1': 1 })
          assert(state.getNoteStatus(note) === 'judged')
          assert(state.getNoteJudgment(note) === -1)
        })
        it('gives 2 missed judgment for missed longnote', function () {
          advance(2.3, { 'p1_1': 1 })
          assert(state.stats.numJudgments === 2)
        })
        it('judges long note lifted too fast as missed', function () {
          advance(2, { 'p1_1': 1 })
          advance(2.01, { 'p1_1': 0 })
          assert(state.getNoteStatus(note) === 'judged')
          assert(state.getNoteJudgment(note) === -1)
          assert(state.stats.numJudgments === 2)
        })
        it('does not end automatically', function () {
          advance(2, { 'p1_1': 1 })
          advance(3.1, { 'p1_1': 1 })
          assert(state.getNoteStatus(note) === 'active')
          assert(state.stats.numJudgments === 1)
        })
        it('judges long note lifted too slow as missed', function () {
          advance(2, { 'p1_1': 1 })
          advance(4, { 'p1_1': 1 })
          assert(state.getNoteStatus(note) === 'judged')
          assert(state.getNoteJudgment(note) === -1)
          assert.deepEqual(
            state.notifications.judgments[0],
            { judgment: -1, combo: 0, delta: 1, column: note.column }
          )
        })
      })

      describe('with long scratch note', function () {
        let note
        beforeEach(function () {
          setup(`
            #BPM 120
            #00156:0101
          `)
          note = chart.notes[0]
        })
        it('ends automatically', function () {
          advance(2, { 'p1_SC': 1 })
          assert(state.getNoteStatus(note) === 'active')
          assert(state.getNoteJudgment(note) === 1)
          assert(state.notifications.judgments[0].judgment === 1)
          advance(3.1, { 'p1_SC': 1 })
          assert(state.getNoteStatus(note) === 'judged')
          assert(state.getNoteJudgment(note) === 1)
          assert(state.notifications.judgments[0].judgment === 1)
        })
      })

      describe('with long scratch note next to each other', function () {
        beforeEach(function () {
          setup(`
#BPM 120
#00156:0100000000000000000000000000000000000000000000000000000000000001
#00256:0100000000000000000000000000000000000000000000000000000000000001
          `)
        })
        it('should switch to next one on change', function () {
          advance(2, { 'p1_SC': 1 })
          advance(4, { 'p1_SC': -1 })
          assert(state.getNoteStatus(chart.notes[0]) === 'judged')
          assert(state.getNoteStatus(chart.notes[1]) === 'active')
        })
      })

      describe('sound notifications', function () {
        it('notifies of note hit', function () {
          setup(`
            #BPM 120
            #00111:0102
          `)
          advance(2, { 'p1_1': 1 })
          assert(state.notifications.sounds[0].note === chart.notes[0])
          assert(state.notifications.sounds[0].type === 'hit')
        })
        it('should notify missed notes as break', function () {
          setup(`
            #BPM 120
            #00111:01
          `)
          advance(5, { 'p1_1': 0 })
          assert(state.notifications.sounds[0].note === chart.notes[0])
          assert(state.notifications.sounds[0].type === 'break')
        })
        it('notifies of free keysound hit', function () {
          setup(`
            #BPM 60
            #00111:01
            #00211:02
          `)

          // hit the first note
          advance(4, { 'p1_1': 1 })
          advance(4, { 'p1_1': 0 })

          // hit the blank area
          advance(4, { 'p1_1': 1 })
          assert(state.notifications.sounds[0].note === chart.notes[0])
          assert(state.notifications.sounds[0].type === 'free')

          // release the button
          advance(4, { 'p1_1': 0 })
          assert(!state.notifications.sounds.length)

          // try again
          advance(5, { 'p1_1': 1 })
          assert(state.notifications.sounds[0].note === chart.notes[0])

          // release the button
          advance(5, { 'p1_1': 0 })

          // wait and try again.
          advance(6.5, { 'p1_1': 1 })
          assert(state.notifications.sounds[0].note === chart.notes[0])
          advance(6.5, { 'p1_1': 0 })

          // wait and try again. this time keysound should change
          advance(7.5, { 'p1_1': 1 })
          assert(state.notifications.sounds[0].note === chart.notes[1])
        })
      })
    })

    describe('speed', function () {
      it('infers speed from player', function () {
        setup('', { speed: 2 })
        assert(state.speed === 2)
      })
      it('updates speed on dedicated buttons', function () {
        setup('', { speed: 2 })
        advance(1.0, { 'p1_speedup': 1 })
        assert(state.speed === 2.5)
        advance(1.2, { 'p1_speedup': 0, 'p1_speeddown': 1 })
        assert(state.speed === 2)
      })
      it('supports fine-grained speed modifications', function () {
        setup('', { speed: 2 })
        advance(1.0, { 'p1_speedup': 1, 'select': 1 })
        assert(state.speed === 2.1)
      })
      it('supports pinching to zoom', function () {
        setup('', { speed: 2 })
        advance(1.0, { 'p1_pinch': 300 })
        advance(1.2, { 'p1_pinch': 450 })
        assert(state.speed === 3)
      })
    })

    describe('finish', function () {
      it('should become true when song is finished', function () {
        setup('#00111:0101')
        assert(state.finished === false)
        advance(4.0, { })
        assert(state.finished === false)
        advance(16.0, { })
        assert(state.finished === true)
      })
    })
  })
})
