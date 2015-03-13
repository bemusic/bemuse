
import PlayerDisplay from 'bemuse/game/display/player-display'
import { notechart } from '../spec_helper'

describe('PlayerDisplay', function() {

  it('reacts to input', function() {
    let pd = new PlayerDisplay({
      notechart: notechart(),
      columns: ['wow'],
    })
    let data = pd.update(555, 0.5, {
      input: new Map([
        ['wow', { value: 0, changed: false }]
      ])
    })
    expect(data['wow_active']).to.equal(0)
    data = pd.update(557, 2.5, {
      input: new Map([
        ['wow', { value: 1, changed: true }]
      ])
    })
    expect(data['wow_active']).to.equal(1)
    expect(data['wow_down']).to.equal(557)
    data = pd.update(558, 3.5, {
      input: new Map([
        ['wow', { value: 0, changed: true }]
      ])
    })
    expect(data['wow_active']).to.equal(0)
    expect(data['wow_up']).to.equal(558)
  })

})

