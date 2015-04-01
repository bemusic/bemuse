
import PlayerStats    from 'bemuse/game/state/player-stats'
import { notechart }  from '../spec_helper'

describe('PlayerStats', function() {

  describe('#score', function() {
    it('returns the score', function() {
      let stats = new PlayerStats(notechart('#00111:1111111111'))
      expect(stats.score).to.equal(0)
      stats.handleJudgment(1)
      stats.handleJudgment(1)
      stats.handleJudgment(1)
      stats.handleJudgment(1)
      stats.handleJudgment(1)
      expect(stats.score).to.equal(555555)
    })
  })

})

