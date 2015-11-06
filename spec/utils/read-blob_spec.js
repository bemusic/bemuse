
import readBlob from 'bemuse/utils/read-blob'

describe('readBlob', function () {

  it('rejects when cannot read blob', function () {
    let blob = new Blob(['hello world'])
    let stub = sinon.stub(FileReader.prototype, 'readAsText', function () {
      this.onerror(new Error('...'))
    })
    return expect(readBlob(blob).as('text').finally(() => stub.restore()))
        .to.be.rejected
  })

  it('resolves with correct type', function () {
    let blob = new Blob(['hello world'])
    return expect(readBlob(blob).as('text')).to.eventually.equal('hello world')
  })

})
