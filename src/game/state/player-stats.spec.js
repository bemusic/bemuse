
import PlayerStats    from './player-stats'
import { notechart }  from '../test-helpers'

describe('PlayerStats', function () {

  describe('#score', function () {
    it('returns the score', function () {
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

  describe('#deltas', function () {
    it('returns the deltas', function () {
      let stats = new PlayerStats(notechart('#00111:111111'))
      stats.handleDelta(0.031)
      stats.handleDelta(0.001)
      stats.handleDelta(-0.031)
      expect(stats.deltas).to.deep.equal([ 0.031, 0.001, -0.031 ])
    })
  })

  describe('#log', function () {
    it('returns the log', function () {
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
