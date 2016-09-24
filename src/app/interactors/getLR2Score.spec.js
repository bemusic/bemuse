import assert from 'power-assert'

import getLR2Score from './getLR2Score'

describe('Calculating LR2 score', function () {
  const LR2_NORMAL_TIMEGATE = [ 18, 40 ]
  it('perfect great = 2 points', () => {
    assert(getLR2Score([ 0.001 ], LR2_NORMAL_TIMEGATE) === 2)
  })
  it('great = 1 point', () => {
    assert(getLR2Score([ 0.02 ], LR2_NORMAL_TIMEGATE) === 1)
  })
  it('other = 0 points', () => {
    assert(getLR2Score([ 0.06 ], LR2_NORMAL_TIMEGATE) === 0)
  })
  it('sums the points', () => {
    assert(getLR2Score([ 0.01, 0.02, 0.03, 0.05 ], LR2_NORMAL_TIMEGATE) === 4)
  })
  it('works with arbitrary timegates', () => {
    assert(getLR2Score([ 0.01, 0.02, 0.03, 0.05 ], [ 35, 70 ]) === 7)
  })
})
