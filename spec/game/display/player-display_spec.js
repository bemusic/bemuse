
import PlayerDisplay from 'bemuse/game/display/player-display'
import { tap, notechart, playerWithBMS } from '../spec_helper'

describe('PlayerDisplay', function() {

  let display
  let data

  function setup(player) {
    display = new PlayerDisplay(player)
  }

  function update(t1, t2, state) {
    data = display.update(t1, t2, state)
  }

  it('reacts to input', function() {

    let inputState = (inputs) => makeState({ input: new Map(inputs) })

    setup({
      notechart: notechart(),
      columns: ['wow'],
    })

    update(555, 0.5, inputState([['wow', { value: 0, changed: false }]]))
    expect(data['wow_active']).to.equal(0)

    update(557, 2.5, inputState([['wow', { value: 1, changed: true }]]))
    expect(data['wow_active']).to.equal(1)
    expect(data['wow_down']).to.equal(557)

    update(558, 3.5, inputState([['wow', { value: 0, changed: true }]]))
    expect(data['wow_active']).to.equal(0)
    expect(data['wow_up']).to.equal(558)

  })

  describe('with note', function() {
    beforeEach(function() {
      setup(playerWithBMS('#BPM 60\n#00111:11'))
    })
    it('displays unjudged notes', function() {
      update(3.95, 3.95, blankState())
      expect(data['note_1']).to.have.length(1)
    })
    it('hides judged notes', function() {
      let state = tap(s => s.getNoteStatus.returns('judged'), blankState())
      update(3.95, 3.95, state)
      void expect(data['note_1']).to.be.empty
    })
  })

  describe('with long note', function() {
    beforeEach(function() {
      setup(playerWithBMS('#BPM 60\n#00151:1111'))
    })
    it('displays unjudged notes', function() {
      update(3.95, 3.95, blankState())
      expect(data['longnote_1']).to.have.length(1)
    })
  })

  describe('with notification', function() {
    beforeEach(function() {
      setup(playerWithBMS())
    })
    it('sets judgment time', function() {
      let info = { judgment: 1, delta: 0, combo: 123 }
      update(12, 34, makeState({ notifications: { judgment: info } }))
      expect(data['judge_1']).to.equal(12)
    })
    it('sets judgment missed time', function() {
      let info = { judgment: -1, delta: 0, combo: 0 }
      update(12, 34, makeState({ notifications: { judgment: info } }))
      expect(data['judge_missed']).to.equal(12)
    })
  })

  // Mock PlayerState
  function blankState() {
    return {
      input: { get: () => ({ value: 0, changed: false }) },
      notifications: { },
      getNoteStatus: sinon.stub().returns('unjudged'),
    }
  }

  function makeState(object) {
    return Object.assign(blankState(), object)
  }

})

