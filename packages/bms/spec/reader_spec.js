const { Reader } = require('../lib')
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')

function fixture(name) {
  return fs.readFileSync(path.resolve(__dirname, 'fixtures/' + name))
}

describe('bms.Reader', function () {
  describe('encoding detection', function () {
    it('should detect 7-bit', function () {
      expect(Reader.read(fixture('en'))).to.match(/Hello/)
    })

    it('should detect UTF-8', function () {
      expect(Reader.read(fixture('jp.utf8'))).to.match(/色は匂へど/)
      expect(Reader.read(fixture('kr.utf8'))).to.match(/초콜릿/)
    })

    it('should detect UTF-8 with BOM and strips it', function () {
      expect(Reader.read(fixture('jp.utf8bom')).charAt(0)).to.equal('色')
    })

    it('should detect Shift_JIS', function () {
      expect(Reader.read(fixture('jp.sjis'))).to.match(/色は匂へど/)
    })

    it('should detect EUC-KR', function () {
      expect(Reader.read(fixture('kr.euc-kr'))).to.match(/초콜릿/)
    })

    it('should detect UTF-16LE', function () {
      expect(Reader.read(fixture('jp.utf16le'))).to.match(/色は匂へど/)
      expect(Reader.read(fixture('jp.utf16le')).charCodeAt(0)).not.to.equal(
        0xfeff
      )
    })

    it('should detect UTF-16BE', function () {
      expect(Reader.read(fixture('jp.utf16be'))).to.match(/色は匂へど/)
      expect(Reader.read(fixture('jp.utf16be')).charCodeAt(0)).not.to.equal(
        0xfeff
      )
    })

    it('should should encoding to be forced', function () {
      const options = Reader.getReaderOptionsFromFilename('HYPER.sjis.bms')
      // Unfortunately, the text "隣町の蜃気楼" is detected as EUC-KR.
      // We must provide a way to allow encoding to be fixed.
      expect(Reader.read(fixture('jp-ambiguous.sjis'), options)).to.match(
        /隣町の蜃気楼/
      )
    })
  })

  describe('asynchronous detection', function () {
    it('should work', function (done) {
      let x = false
      Reader.readAsync(fixture('en'), function (err, result) {
        void expect(err).to.be.null
        expect(result).to.match(/Hello/)
        x = true
        done()
      })
      void expect(x).to.be.false
    })
  })
})
