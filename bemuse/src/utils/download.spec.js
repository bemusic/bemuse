import download from 'bemuse/utils/download'

describe('download', function () {
  const options = {
    getRetryDelay: () => 0,
  }

  it('resolves with correct type', function () {
    return expect(
      download('/src/utils/test-fixtures/download/hello.txt').as('text')
    ).to.eventually.match(/hello world/)
  })

  it('rejects for 404', function () {
    return expect(download('/nonexistant').as('blob')).to.be.rejected
  })

  it('rejects for bad url', function () {
    return expect(download('file:///nonexistant', options).as('blob')).to.be
      .rejected
  })

  it('rejects for XHR error', function () {
    const stub = sinon
      .stub(XMLHttpRequest.prototype, 'send')
      .callsFake(function () {
        this.onerror(new Error('...'))
      })
    return expect(
      download('/spec/download/fixtures/hello.txt', options)
        .as('blob')
        .finally(() => stub.restore())
    ).to.be.rejected
  })
})
