
import download from 'bemuse/download'

describe('download', function() {

  it('resolves with correct type', function() {
    return expect(download('/spec/download/fixtures/hello.txt').as('text'))
      .to.eventually.match(/hello world/)
  })

  it('rejects for 404', function() {
    return expect(download('/nonexistant').as('blob')).to.be.rejected
  })

  it('rejects for bad url', function() {
    return expect(download('file:///nonexistant').as('blob')).to.be.rejected
  })

})
