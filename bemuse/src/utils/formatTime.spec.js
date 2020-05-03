import assert from 'power-assert'

import formatTime from './formatTime'

describe('formatTime', () => {
  it('should format the time using minutes:seconds format', () => {
    assert(formatTime(0) === '0:00')
    assert(formatTime(1) === '0:01')
    assert(formatTime(11) === '0:11')
    assert(formatTime(111) === '1:51')
    assert(formatTime(1111) === '18:31')
  })
})
