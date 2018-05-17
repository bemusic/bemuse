
import Payload from '../src/payload'

describe('Payload', function () {
  var payload

  beforeEach(() => payload = new Payload())

  describe('with 2 buffers added: "hello" and ", "', function () {
    beforeEach(() => {
      payload.add(new Buffer('hello'))
      payload.add(new Buffer(', '))
    })

    it('should have size of 7', () => expect(payload.size).to.equal(7))

    it('should have correct hash', () =>
      expect(payload.hash).to.equal('0b76896c047e4a9070813cfe8bdd83f5'))

    it('should return slicing for new buffers', () =>
      expect(payload.add(new Buffer('world!'))).to.deep.equal([7, 13]))
  })
})
