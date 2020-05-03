import * as Scintillator from './'

let fixture = file => `/src/scintillator/test-fixtures/${file}`

describe('Scintillator', function() {
  describe('#load', function() {
    it('should load skin and return skin node', async function() {
      let skin = await Scintillator.load(fixture('bare.xml'))
      expect(skin.width).to.equal(123)
      expect(skin.height).to.equal(456)
    })
    it('should reject if invalid', function() {
      return expect(Scintillator.load(fixture('invalid_tag.xml'))).to.be
        .rejected
    })
  })

  describe('Context', function() {
    it('should instantiate and able to destroy', async function() {
      let skin = await Scintillator.load(fixture('bare.xml'))
      let context = new Scintillator.Context(skin)
      context.render({})
      context.destroy()
    })
    describe('#input', function() {
      let skin
      let context
      beforeEach(async function() {
        skin = await Scintillator.load(fixture('bare.xml'))
        context = new Scintillator.Context(skin)
        context.render({})
        context.view.style.position = 'fixed'
        context.view.style.top = '0'
        context.view.style.left = '0'
        document.body.appendChild(context.view)
      })
      afterEach(function() {
        context.destroy()
        document.body.removeChild(context.view)
      })
      function mouse(type, x, y) {
        context.view.dispatchEvent(
          new MouseEvent(`mouse${type}`, {
            clientX: x,
            clientY: y,
          })
        )
      }
      function touch(type, touches, changedTouches) {
        // since TouchEvent is damn complicated, we resort to using a custom
        // event that imitates a touch event.
        let event = new Event(`touch${type}`)
        event.touches = touches
        event.changedTouches = changedTouches
        context.view.dispatchEvent(event)
      }
      it('should report touches/mouse inside the region', function() {
        mouse('move', 10, 10)
        mouse('down', 10, 10)
        expect(context.input).to.deep.equal([{ x: 10, y: 10, id: 'mouse' }])
        let t = { identifier: 1, clientX: 80, clientY: 80 }
        touch('start', [t], [t])
        expect(context.input).to.deep.equal([
          { x: 10, y: 10, id: 'mouse' },
          { x: 80, y: 80, id: 'touch1' },
        ])
        mouse('move', 20, 20)
        expect(context.input).to.deep.equal([
          { x: 20, y: 20, id: 'mouse' },
          { x: 80, y: 80, id: 'touch1' },
        ])
        mouse('up', 10, 10)
        expect(context.input).to.deep.equal([{ x: 80, y: 80, id: 'touch1' }])
        touch('end', [], [t])
        expect(context.input).to.deep.equal([])
      })
    })
    describe('#refs', function() {
      it('should be a set of refs to the display object', async function() {
        let skin = await Scintillator.load(fixture('refs.xml'))
        let context = new Scintillator.Context(skin)
        context.render({})
        expect(Array.from(context.refs['a'])[0]).to.equal(
          context.stage.children[0]
        )
        context.destroy()
      })
    })
  })

  describe('Expressions', function() {
    it('should be parsed and processed', async function() {
      let skin = await Scintillator.load(fixture('expr_basic.xml'))
      let context = new Scintillator.Context(skin)
      context.render({})
      let stage = context.stage
      expect(stage.children[0].x).to.equal(6)
      expect(stage.children[0].y).to.equal(7)
      context.destroy()
    })
    it('should support variables', async function() {
      let skin = await Scintillator.load(fixture('expr_variables.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ a: 4, b: 3 })
      expect(stage.children[0].x).to.equal(7)
      expect(stage.children[0].y).to.equal(12)
      context.render({ a: 10, b: 20 })
      expect(stage.children[0].x).to.equal(30)
      expect(stage.children[0].y).to.equal(200)
      context.destroy()
    })
  })

  describe('SpriteNode', function() {
    it('should allow setting sprite frame', async function() {
      let skin = await Scintillator.load(fixture('sprite_attrs.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({})
      let frame = stage.children[0].texture.frame
      expect(frame.width).to.equal(10)
      expect(frame.height).to.equal(11)
      expect(frame.x).to.equal(12)
      expect(frame.y).to.equal(13)
      context.destroy()
    })
    it('should allow setting visibility, width, height', async function() {
      let skin = await Scintillator.load(fixture('sprite_attrs.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({})
      let sprite = stage.children[0]
      expect(sprite.width).to.equal(3)
      expect(sprite.height).to.equal(1)
      expect(sprite.visible).to.equal(false)
      context.destroy()
    })
    it('should reject if blend mode is invalid', function() {
      return expect(Scintillator.load(fixture('sprite_invalid_blend.xml'))).to
        .be.rejected
    })
  })

  describe('TextNode', function() {
    it('should display text', async function() {
      let skin = await Scintillator.load(fixture('text.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({})
      let text = stage.children[0].children[0]
      expect(text.text).to.equal('Hello world')
      context.destroy()
    })
    it('should center text', async function() {
      let skin = await Scintillator.load(fixture('text_center.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({})
      let text = stage.children[0].children[0]
      expect(text.x).to.be.lessThan(0)
      context.destroy()
    })
    it('should support data interpolation', async function() {
      let skin = await Scintillator.load(fixture('text_interpolation.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ lol: 'wow' })
      let text = stage.children[0].children[0]
      expect(text.text).to.equal('Hello world wow')
      context.destroy()
    })
  })

  describe('IfNode', function() {
    let skin
    let context
    let stage
    beforeEach(async function() {
      skin = await Scintillator.load(fixture('expr_if.xml'))
      context = new Scintillator.Context(skin)
      stage = context.stage
    })
    afterEach(function() {
      context.destroy()
    })
    it('should display child when correct value', function() {
      context.render({ a: 'b' })
      expect(stage.children[0].children).to.have.length(1)
      context.render({ a: 'x' })
      expect(stage.children[0].children).to.have.length(0)
    })
  })

  describe('ObjectNode', function() {
    it('should display children', async function() {
      let skin = await Scintillator.load(fixture('expr_object.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      context.render({ notes: [] })
      expect(stage.children[0].children).to.have.length(0)
      context.render({ notes: [{ key: 'a', y: 20 }] })
      expect(stage.children[0].children).to.have.length(1)
      context.render({ notes: [{ key: 'a', y: 20 }, { key: 'b', y: 10 }] })
      expect(stage.children[0].children).to.have.length(2)
      context.render({ notes: [{ key: 'b', y: 10 }] })
      expect(stage.children[0].children).to.have.length(1)
      context.destroy()
    })
    it('should update same array with content changed', async function() {
      let skin = await Scintillator.load(fixture('expr_object.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      let notes = []
      context.render({ notes })
      expect(stage.children[0].children).to.have.length(0)
      notes.push({ key: 'a', y: 20 })
      context.render({ notes })
      expect(stage.children[0].children).to.have.length(1)
      context.destroy()
    })
    it('should let children get value from item', async function() {
      let skin = await Scintillator.load(fixture('expr_object_var.xml'))
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
    })
  })

  describe('GroupNode', function() {
    it('should allow masking', async function() {
      let skin = await Scintillator.load(fixture('group_mask.xml'))
      let context = new Scintillator.Context(skin)
      let stage = context.stage
      let mask = stage.children[0].mask
      expect(mask).not.to.equal(null)
      context.destroy()
    })
  })

  describe('AnimationNode', function() {
    it('should allow animations', async function() {
      let skin = await Scintillator.load(fixture('animation.xml'))
      let context = new Scintillator.Context(skin)
      let group = context.stage.children[0]
      context.render({ t: 0 })
      expect(group.x).to.equal(10)
      expect(group.y).to.equal(0)
      context.render({ t: 0.5 })
      expect(group.x).to.equal(15)
      expect(group.y).to.equal(1)
      context.render({ t: 1 })
      expect(group.x).to.equal(20)
      expect(group.y).to.equal(2)
      context.destroy()
    })
    it('should allow animations on different events', async function() {
      let skin = await Scintillator.load(fixture('animation.xml'))
      let context = new Scintillator.Context(skin)
      let group = context.stage.children[0]
      context.render({ t: 0.5, exitEvent: 0.5 })
      expect(group.x).to.equal(50)
      expect(group.y).to.equal(0)
      context.render({ t: 1, exitEvent: 0.5 })
      expect(group.x).to.equal(60)
      expect(group.y).to.equal(50)
      context.render({ t: 1.5, exitEvent: 0.5 })
      expect(group.x).to.equal(70)
      expect(group.y).to.equal(100)
      context.destroy()
    })
    it('should allow animations on different value', async function() {
      let skin = await Scintillator.load(fixture('animation_timekey.xml'))
      let context = new Scintillator.Context(skin)
      let group = context.stage.children[0]
      context.render({ t: 0, x: 0.5 })
      expect(group.x).to.equal(15)
    })
  })

  describe('defs', function() {
    it('should allow reuse of skin nodes', async function() {
      let skin = await Scintillator.load(fixture('defs.xml'))
      let context = new Scintillator.Context(skin)
      context.render({})
      let stage = context.stage
      expect(stage.children[0].x).to.equal(6)
      expect(stage.children[0].y).to.equal(7)
      expect(stage.children[1].x).to.equal(6)
      expect(stage.children[1].y).to.equal(7)
      context.destroy()
    })
  })
})
