import * as Options from './Options'

import assert from 'power-assert'

describe('Options', function () {
  describe('Lane cover', function () {
    it('should be a number', () => {
      assert(Options.laneCover({ 'player.P1.lane-cover': '0' }) === 0)
    })
    it('should be maximum 50%', () => {
      assert(Options.laneCover({ 'player.P1.lane-cover': '99' }) === 0.5)
    })
    it('should be minimum -50%', () => {
      assert(Options.laneCover({ 'player.P1.lane-cover': '-99' }) === -0.5)
    })
  })
})
