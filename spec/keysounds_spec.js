
var Keysounds = require('../keysounds')

describe('Keysounds', function() {

  describe('#files', function() {
    it('should get list of all files', function() {
      expect(new Keysounds({
        'AA': 'a.wav',
        'BB': 'a.ogg',
        'CC': 'a.wav',
      }).files()).to.deep.equal(['a.wav', 'a.ogg'])
    })
  })

})

