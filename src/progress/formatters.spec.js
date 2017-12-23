import * as Formatters from './formatters'
import Progress from './'

describe('ProgressFormatters', function () {
  describe('BYTES_FORMATTER', function () {
    it('should return blank for indeterminate', function () {
      let p = new Progress()
      expect(Formatters.BYTES_FORMATTER(p)).to.equal('')
    })
    it('should format as human readable size', function () {
      let p = new Progress()
      p.report(1, 1024)
      expect(Formatters.BYTES_FORMATTER(p)).to.equal('1B / 1KB')
    })
  })

  describe('EXTRA_FORMATTER', function () {
    it('should just use the extra', function () {
      let p = new Progress()
      p.report(1, 1024, 'one.wav')
      expect(Formatters.EXTRA_FORMATTER(p)).to.equal('one.wav')
    })
  })
})
