import assert from 'power-assert'

import URLResource from './url'

describe('URLResource', function () {
  it('can download a resource from an arbitrary URL', function () {
    const resource = new URLResource('/src/resources/test-fixtures/f/meow.txt')
    return resource
      .read()
      .then(buffer => new Uint8Array(buffer))
      .then(array => {
        expect([array[0], array[1]]).to.deep.equal([0x68, 0x69])
      })
  })
  it('can retrieve back the URL', function () {
    const resource = new URLResource('/src/resources/test-fixtures/f/meow.txt')
    return resource.resolveUrl().then(url => {
      assert(/\/meow\.txt$/.test(url))
    })
  })
  it('has a name, which is only the file name without the path', function () {
    const resource = new URLResource('/src/resources/test-fixtures/f/meow.txt')
    assert(resource.name === 'meow.txt')
  })
})
