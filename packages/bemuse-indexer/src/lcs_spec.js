import { lcs } from './lcs'
import { expect } from 'chai'

describe('lcs', function () {
  it('should find longest common substring', function () {
    expect(lcs('wonderland', 'erlang')).to.equal('erlan')
  })

  it('should return shorter one when prefix matches', function () {
    expect(lcs('harm', 'harmony')).to.equal('harm')
    expect(lcs('harmony', 'harm')).to.equal('harm')
  })
})
