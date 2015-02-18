
import BemusePackageResources from 'bemuse/resources/bemuse-package'

describe('BemusePackageResources', function() {

  describe('#file', function() {

    var resources

    beforeEach(function() {
      resources = new BemusePackageResources('/spec/resources/fixtures/a/')
    })

    it('returns a file', function() {
      return expect(resources.file('do.mp3')).to.be.fulfilled
    })

    it('rejects if file not found', function() {
      return expect(resources.file('wow.mp3')).to.be.rejected
    })

    it('can be read', function() {
      return expect(resources.file('mi.mp3')
        .then(file => file.read())
        .then(buffer => buffer.byteLength)).to.eventually.eq(30093)
    })

  })

})
