import assert from 'power-assert'

import PlayerDisplay from './player-display'
import { notechart, playerWithBMS, tap } from '../test-helpers'

describe('PlayerDisplay', function () {
  let display
  let data

  function setup (player) {
    display = new PlayerDisplay(player)
  }

  function update (t1, t2, state) {
    data = display.update(t1, t2, state)
  }

  it('reacts to input', function () {
    let inputState = inputs => makeState({ input: new Map(inputs) })

    setup({
      notechart: notechart(),
      columns: ['wow'],
      options: {
        placement: 'center',
        scratch: 'left'
      }
    })

    update(555, 0.5, inputState([['wow', { value: 0, changed: false }]]))
    assert(data['wow_active'] === 0)

    update(557, 2.5, inputState([['wow', { value: 1, changed: true }]]))
    assert(data['wow_active'] === 1)
    assert(data['wow_down'] === 557)

    update(558, 3.5, inputState([['wow', { value: 0, changed: true }]]))
    assert(data['wow_active'] === 0)
    assert(data['wow_up'] === 558)
  })

  describe('with note', function () {
    beforeEach(function () {
      setup(playerWithBMS('#BPM 60\n#00111:11'))
    })
    it('displays unjudged notes', function () {
      update(3.95, 3.95, blankState())
      assert(data['note_1'].length === 1)
    })
    it('hides judged notes', function () {
      let state = tap(blankState(), s => s.getNoteStatus.returns('judged'))
      update(3.95, 3.95, state)
      assert(!(data['note_1'] || []).length)
    })
  })

  describe('with long note', function () {
    beforeEach(function () {
      setup(playerWithBMS('#BPM 60\n#00151:1111'))
    })
    it('displays unjudged long notes', function () {
      update(3.95, 3.95, blankState())
      assert(data['longnote_1'].length === 1)
      assert(!data['longnote_1'][0].active)
      assert(!data['longnote_1'][0].missed)
    })
    it('displays holding long notes', function () {
      let state = tap(blankState(), s => s.getNoteJudgment.returns(1))
      update(3.95, 3.95, state)
      assert(data['longnote_1'][0].active)
    })
    it('displays holding long notes event it is bad', function () {
      let state = tap(blankState(), s => s.getNoteJudgment.returns(4))
      update(3.95, 3.95, state)
      assert(data['longnote_1'][0].active)
    })
    it('displays missed long notes', function () {
      let state = blankState()
      state.getNoteJudgment.returns(-1)
      state.getNoteStatus.returns('judged')
      update(3.95, 3.95, state)
      assert(data['longnote_1'][0].missed)
    })
  })

  describe('with notification', function () {
    beforeEach(function () {
      setup(playerWithBMS())
    })
    it('sets judgment time', function () {
      let info = { judgment: 1, delta: 0, combo: 123, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(data['judge_1'] === 12)
      assert(data['judge_deviation_none'] === 12)
    })
    it('sets judgment deviation (early)', function () {
      let info = { judgment: 2, delta: -0.03, combo: 123, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(data['judge_2'] === 12)
      assert(data['judge_deviation_early'] === 12)
    })
    it('sets judgment deviation (late)', function () {
      let info = { judgment: 2, delta: 0.03, combo: 123, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(data['judge_2'] === 12)
      assert(data['judge_deviation_late'] === 12)
    })
    it('sets judgment missed time', function () {
      let info = { judgment: -1, delta: 0, combo: 0, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(data['judge_missed'] === 12)
    })
    it('sets combo', function () {
      let info = { judgment: 1, delta: 0, combo: 123, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(data['combo'] === 123)
    })
    it('sets note explode time', function () {
      let info = { judgment: 1, delta: 0, combo: 123, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(data['SC_explode'] === 12)
    })
    it('does not set note explode time if missed', function () {
      let info = { judgment: -1, delta: 0, combo: 123, column: 'SC' }
      update(12, 34, makeState({ notifications: { judgments: [info] } }))
      assert(!(data['SC_explode'] || []).length)
    })
  })

  // Mock PlayerState
  function blankState () {
    return {
      speed: 1,
      input: { get: () => ({ value: 0, changed: false }) },
      notifications: { judgments: [] },
      getNoteStatus: sinon.stub().returns('unjudged'),
      getNoteJudgment: sinon.stub().returns(0),
      stats: { score: 0 }
    }
  }

  function makeState (object) {
    return Object.assign(blankState(), object)
  }
})
