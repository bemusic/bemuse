
import lcs from '../src/lcs'

describe('lcs', function() {

  it('should find longest common substring', function() {
    expect(lcs('wonderland', 'erlang')).to.equal('erlan')
  })

})
