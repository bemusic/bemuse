
var Reader = require('../reader')
var fs = require('fs')

function fixture (name) {
  return fs.readFileSync(__dirname + '/fixtures/' + name)
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
      expect(Reader.read(fixture('jp.utf16le')).charCodeAt(0)
            ).not.to.equal(0xFEFF)
    })

    it('should detect UTF-16BE', function () {
      expect(Reader.read(fixture('jp.utf16be'))).to.match(/色は匂へど/)
      expect(Reader.read(fixture('jp.utf16be')).charCodeAt(0)
            ).not.to.equal(0xFEFF)
    })

  })

  describe('asynchronous detection', function () {

    it('should work', function (done) {
      var x = false
      Reader.readAsync(fixture('en'), function (err, result) {
        expect(err).to.be.null()
        expect(result).to.match(/Hello/)
        x = true
        done()
      })
      expect(x).to.be.false()
    })

  })

})
