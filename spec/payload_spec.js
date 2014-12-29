
import Payload from '../src/payload'

describe('Payload', function() {

  var payload

  beforeEach(() => payload = new Payload())

  describe('with 2 buffers added: "hello" and ", "', function() {

    beforeEach(() => {
      payload.add(new Buffer('hello'))
      payload.add(new Buffer(', '))
    })

    it('should have size of 7', () => expect(payload.size).toBe(7))

    it('should return slicing for new buffers', () =>
      expect(payload.add(new Buffer('world!'))).toEqual([7, 13]))

  })

})
