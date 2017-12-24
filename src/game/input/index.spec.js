import GameInput from './'

describe('GameInput', function () {
  let input
  let plugin

  beforeEach(function () {
    input = new GameInput()
    plugin = {
      out: {},
      get () {
        return this.out
      }
    }
    input.use(plugin)
  })

  it('should return control with default value of 0', function () {
    expect(input.get('wow').value).to.equal(0)
  })

  describe('Control#value', function () {
    it('should return control with correct value', function () {
      plugin.out = { wow: -1 }
      input.update()
      expect(input.get('wow').value).to.equal(-1)
    })
  })

  describe('Control#changed', function () {
    it('should return changed state between last update', function () {
      input.update()
      expect(input.get('wow').changed).to.equal(false)
      plugin.out = { wow: 0 }
      input.update()
      expect(input.get('wow').changed).to.equal(false)
      plugin.out = { wow: -1 }
      input.update()
      expect(input.get('wow').changed).to.equal(true)
      plugin.out = { wow: 1 }
      input.update()
      expect(input.get('wow').changed).to.equal(true)
      plugin.out = { wow: 1 }
      input.update()
      expect(input.get('wow').changed).to.equal(false)
      input.update()
      expect(input.get('wow').changed).to.equal(false)
      plugin.out = { wow: 0 }
      input.update()
      expect(input.get('wow').changed).to.equal(true)
    })
  })
})
