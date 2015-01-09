
import Payload from '../src/payload'

describe('Payload', function() {

  var payload

  beforeEach(() => payload = new Payload())

  describe('with 2 buffers added: "hello" and ", "', function() {

    beforeEach(() => {
      payload.add(new Buffer('hello'))
      payload.add(new Buffer(', '))
    })

    it('should have size of 7', () => expect(payload.size).to.equal(7))

    it('should have correct hash', () =>
      expect(payload.hash).to.equal('52b02aa91ac578dc41ea70335db3507cb5b799d5'))

    it('should return slicing for new buffers', () =>
      expect(payload.add(new Buffer('world!'))).to.deep.equal([7, 13]))

  })

})
