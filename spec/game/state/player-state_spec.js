
import PlayerState from 'bemuse/game/state/player-state'

describe('PlayerState', function() {

  it('updates the input', function() {
    let state = new PlayerState({
      number:  1,
      columns: ['wow'],
    })
    let input = {
      get:     name => ({ name })
    }
    state.update(0, input)
    expect(state.input.get('wow').name).to.equal('p1_wow')
  })

})

