
var lcs = require('./lcs')
var expect = require('chai').expect

describe('lcs', function() {

  it('should find longest common substring', function() {
    expect(lcs('wonderland', 'erlang')).to.equal('erlan')
  })

})
