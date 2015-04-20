
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

    it('cannot read if not bemuse file', function() {
      resources = new BemusePackageResources('/spec/resources/fixtures/b/')
      return expect(resources.file('do.mp3')
        .then(file => file.read()))
        .to.be.rejected
    })

    it('data is correct', function() {
      return resources.file('mi.mp3')
        .then(file => file.read())
        .then(buffer => new Uint8Array(buffer))
        .then(array => {
          expect([array[0], array[1], array[2]]).to.deep.equal(
            [0xff, 0xfb, 0x90])
        })
    })

  })

})
