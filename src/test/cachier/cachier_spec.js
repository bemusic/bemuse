
import { Cachier } from '../../cachier'

let promised = fn => callback => {
  Promise.resolve(fn()).then(
    () => { callback() },
    e  => { expect(() => { throw e }).not.toThrow(); callback() }
  )
}

xdescribe('Cachier', function() {

  let cachier

  beforeEach(() => cachier = new Cachier('test'))
  afterEach(promised(() => cachier.destroy()))

  describe('#save', () => {
    it('stores a blob', promised(() => {
      let blob = new Blob(['hello'])
      return cachier.save('wow', blob)
        .then(result => expect(result).toBeTruthy())
    }))
  })

  describe('with a blob stored', () => {

    beforeEach(promised(() => {
      let blob = new Blob(['hello'])
      return cachier.save('wow4', blob)
    }))

    describe('#load', function() {
      it('should return the blob value', promised(() => {
        return cachier.load('wow4').then(function({ blob, metadata }) {
          expect(blob.size).toBe(5)
          expect(metadata).toBe(undefined)
        })
      }))
    })

  })

})
