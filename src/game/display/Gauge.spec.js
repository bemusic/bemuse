import assert from 'power-assert'

import { getGauge } from './Gauge'

describe('an inactive gauge', () => {
  it('does not display anything', () => {
    const gauge = getGauge('off')
    gauge.update()
    assert(gauge.shouldDisplay() === false)
    assert(gauge.getPrimary() === 0)
    assert(gauge.getSecondary() === 0)
  })
})

describe('a hope gauge', () => {
  function setup (maxPossibleScore, progress) {
    const gauge = getGauge('hope')
    const [numJudgments, totalCombo] = progress
    const playerStats = { maxPossibleScore, numJudgments, totalCombo }
    const playerState = { stats: playerStats }
    gauge.update(playerState)
    return gauge
  }
  it('should be displayed if user can attain A rank', () => {
    const gauge = setup(450001, [50, 100])
    assert(gauge.shouldDisplay())
  })
  it('should be hidden if user cannot attain A rank anymore', () => {
    const gauge = setup(449999, [50, 100])
    assert(!gauge.shouldDisplay())
  })
  describe('primary', () => {
    it('starts at half', () => {
      const gauge = setup(555555, [0, 100])
      assert(gauge.getPrimary() === 0.5)
    })
    it('completely fills in if player finishes with ≥520000', () => {
      const gauge = setup(555555, [100, 100])
      assert(gauge.getPrimary() === 1)
    })
    it('is active if player can still attain S rank', () => {
      const gauge = setup(500001, [100, 100])
      assert(gauge.getPrimary() > 0)
      assert(gauge.getPrimary() < 0.01)
    })
    it('is inactive if player cannot attain S rank anymore', () => {
      const gauge = setup(499999, [100, 100])
      assert(gauge.getPrimary() === 0)
    })
  })
  describe('secondary', () => {
    it('inactive while player still can attain S rank', () => {
      const gauge = setup(500001, [40, 100])
      assert(gauge.getSecondary() === 0)
    })
    it('active while player still can attain A rank', () => {
      const gauge = setup(499999, [40, 100])
      assert(gauge.getSecondary() >= 0.99)
    })
    it('zeroes out when user cannot attain A rank anymore', () => {
      const gauge = setup(449999, [40, 100])
      assert(gauge.getSecondary() === 0)
    })
  })
  describe('extra', () => {
    it('starts at 0', () => {
      const gauge = setup(555555, [0, 100])
      assert(gauge.getExtra() === 0)
    })
    it('is not activated if hoped score would not exceed 520000', () => {
      const gauge = setup(519999, [100, 100])
      assert(gauge.getExtra() === 0)
    })
    it('is activated if hoped score would exceed 520000', () => {
      const gauge = setup(520001, [100, 100])
      assert(gauge.getExtra() > 0)
    })
    it('completely fills in if player finishes with ≥540000', () => {
      const preGauge = setup(539999, [100, 100])
      assert(preGauge.getExtra() < 1)
      const gauge = setup(540000, [100, 100])
      assert(gauge.getExtra() === 1)
    })
  })
})
