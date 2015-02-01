
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
      return expect(Scintillator.load(fixture('invalid_tag.xml')))
          .to.be.rejected
    })
    it('should reject if image not declared', function() {
      return expect(Scintillator.load(fixture('invalid_no_image.xml')))
          .to.be.rejected
    })
  })

  describe('Context', function() {
    it('should instantiate and able to destroy', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('bare.xml'))
      let context = new Scintillator.Context(skin)
      context.render({})
      context.destroy()
    }))
  })

  describe('Expressions', function() {
    it('should be parsed and processed', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('expr_basic.xml'))
      let context = new Scintillator.Context(skin)
      context.render({})
      let stage = context.stage
      expect(stage.children[0].x).to.equal(6)
      expect(stage.children[0].y).to.equal(7)
      context.destroy()
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
      context.destroy()
    }))
  })

  describe('SpriteNode', function() {
    it('should allow setting sprite frame', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('sprite_attrs.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ })
      let frame = stage.children[0].texture.frame
      expect(frame.width).to.equal(10)
      expect(frame.height).to.equal(11)
      expect(frame.x).to.equal(12)
      expect(frame.y).to.equal(13)
      context.destroy()
    }))
    it('should allow setting visibility, width, height', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('sprite_attrs.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ })
      let sprite = stage.children[0]
      expect(sprite.width).to.equal(3)
      expect(sprite.height).to.equal(1)
      expect(sprite.visible).to.equal(false)
      context.destroy()
    }))
    it('should reject if blend mode is invalid', function() {
      return expect(Scintillator.load(fixture('sprite_invalid_blend.xml')))
                .to.be.rejected
    })
  })

  describe('ObjectNode', function() {
    it('should display children', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('expr_object.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ notes: [] })
      expect(stage.children[0].children).to.have.length(0)
      context.render({ notes: [{ key: 'a', y: 20 }] })
      expect(stage.children[0].children).to.have.length(2)
      context.render({ notes: [{ key: 'a', y: 20 }, { key: 'b', y: 10 }] })
      expect(stage.children[0].children).to.have.length(4)
      context.render({ notes: [{ key: 'b', y: 10 }] })
      expect(stage.children[0].children).to.have.length(2)
      context.destroy()
    }))
    it('should let children get value from item', co.wrap(function*() {
      let skin = yield Scintillator.load(fixture('expr_object_var.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ notes: [] })
      context.render({ notes: [{ key: 'a', y: 20 }] })
      expect(stage.children[0].children[0].y).to.equal(20)
      context.render({ notes: [{ key: 'a', y: 20 }, { key: 'b', y: 10 }] })
      expect(stage.children[0].children[0].y).to.equal(20)
      context.render({ notes: [{ key: 'b', y: 10 }] })
      expect(stage.children[0].children[0].y).to.equal(10)
      context.destroy()
    }))
  })

})

