
import PlayerState    from 'bemuse/game/state/player-state'
import Player         from 'bemuse/game/player'
import GameInput      from 'bemuse/game/input'
import { notechart }  from '../spec_helper'

describe('PlayerState', function() {

  it('updates the input', function() {
    let state = new PlayerState({
      number: 1,
      columns: ['wow'],
      notechart: notechart(''),
    })
    let input = {
      get: name => ({ name })
    }
    state.update(0, input)
    expect(state.input.get('wow').name).to.equal('p1_wow')
  })

  describe('note judging', function() {

    let chart
    let player
    let state
    let input
    let buttons

    function setup(bms) {
      chart   = notechart(bms)
      player  = new Player(chart, 1, { })
      state   = new PlayerState(player)
      input   = new GameInput()
      buttons = { }
      input.use({ get: () => buttons })
    }

    function advance(time, b) {
      buttons = b
      input.update()
      state.update(time, input)
    }

    it('judges notes', function() {

      setup(`
        #BPM 120
        #00111:0101
      `)

      expect(state.getNoteStatus(chart.notes[0])).to.equal('unjudged')

      advance(1.999, { })
      expect(state.getNoteStatus(chart.notes[0])).to.equal('unjudged')

      advance(2, { 'p1_1': 1 })
      expect(state.getNoteStatus(chart.notes[0])).to.equal('judged')
      expect(state.getNoteJudgment(chart.notes[0])).to.equal(1)
      expect(state.getNoteStatus(chart.notes[1])).to.equal('unjudged')

      advance(2.1, { 'p1_1': 0 })
      advance(5,   { 'p1_1': 0 })
      expect(state.getNoteStatus(chart.notes[1])).to.equal('judged')
      expect(state.getNoteJudgment(chart.notes[1])).to.equal(-1)

    })

  })

})

