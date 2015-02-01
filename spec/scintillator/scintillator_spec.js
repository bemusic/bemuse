
import co from 'co'

import * as Scintillator from '../../src/scintillator'

let fixture = file => `/spec/scintillator/fixtures/${file}`

describe('Scintillator', function() {

  describe('#load', function() {
    it('should load skin and return skin node', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('bare.xml'))
      expect(skin.width).to.equal(123)
      expect(skin.height).to.equal(456)
    }))
    it('should reject if invalid', function() {
      return expect(Scintillator.load(fixture('invalid.xml'))).to.be.rejected
    })
  })

  describe('Expressions', function() {
    it('should be parsed and processed', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('expr_basic.xml'))
      let context = new Scintillator.Context(skin)
      context.render({})
      let stage = context.stage
      expect(stage.children[0].x).to.equal(3)
      expect(stage.children[0].y).to.equal(7)
    }))
    it('should support variables', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('expr_variables.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ a: 4, b: 3 })
      expect(stage.children[0].x).to.equal(7)
      expect(stage.children[0].y).to.equal(12)
      context.render({ a: 10, b: 20 })
      expect(stage.children[0].x).to.equal(30)
      expect(stage.children[0].y).to.equal(200)
    }))
  })

})

