
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

  describe('#log', function() {
    it('returns the log', function() {
      let stats = new PlayerStats(notechart('#00111:11111111111111'))
      expect(stats.score).to.equal(0)
      stats.handleJudgment(1)
      stats.handleJudgment(1)
      stats.handleJudgment(1)
      stats.handleJudgment(2)
      stats.handleJudgment(3)
      stats.handleJudgment(-1)
      stats.handleJudgment(-1)
      expect(stats.log).to.equal('3ABC2M')
    })
  })
})
