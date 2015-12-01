
import { OmniInput, getName, key川, _key川ForUpdate川 } from 'bemuse/omni-input'
import { EventEmitter } from 'events'
import assert from 'power-assert'
import Bacon from 'baconjs'


function fakeWindow () {
  const events = new EventEmitter()
  const gamepads = [ ]
  return {
    addEventListener (name, callback) {
      events.on(name, callback)
    },
    removeEventListener (name, callback) {
      events.removeListener(name, callback)
    },
    setInterval (callback) {
      events.on('timeout', callback)
      return callback
    },
    clearInterval (callback) {
      events.removeListener('timeout', callback)
    },
    keydown (keyCode) {
      events.emit('keydown', { which: keyCode })
    },
    keyup (keyCode) {
      events.emit('keyup', { which: keyCode })
    },
    tick () {
      events.emit('timeout')
    },
    gamepads,
    navigator: {
      getGamepads () {
        return gamepads
      }
    }
  }
}


describe('OmniInput', function () {

  beforeEach(function () {
    this.window = fakeWindow()
    this.input = new OmniInput(this.window)
  })

  afterEach(function () {
    this.input.dispose()
  })

  describe('keyboard', function () {
    it('recognizes input', function () {
      this.window.keydown(32)
      assert(this.input.update()['32'])
      this.window.keyup(32)
      assert(!this.input.update()['32'])
    })
    it('returns the key name', function () {
      assert(getName('32') === 'Space')
      assert(getName('65') === 'A')
    })
  })

  describe('gamepad', function () {
    it('recognizes input', function () {
      this.window.gamepads.push(null, {
        index: 1,
        buttons: [
          { },
          { value: 0.9 },
        ],
        axes: [
          0,
          0.9,
          -0.9,
        ],
      })
      const data = this.input.update()
      assert(!data['gamepad.1.button.0'])
      assert(data['gamepad.1.button.1'])
      assert(!data['gamepad.1.axis.0'])
      assert(!data['gamepad.1.axis.0.positive'])
      assert(!data['gamepad.1.axis.0.negative'])
      assert(data['gamepad.1.axis.1.positive'])
      assert(!data['gamepad.1.axis.1.negative'])
      assert(data['gamepad.1.axis.2.negative'])
      assert(!data['gamepad.1.axis.2.positive'])
    })
    it('returns the key name', function () {
      assert(getName('32') === 'Space')
      assert(getName('65') === 'A')
    })
  })

  describe('key川', function () {
    it('should return events', function () {
      let last
      const dispose = key川(this.input, this.window).onValue(value => last = value)

      this.window.keydown(32)
      this.window.tick()
      assert(last === '32')

      dispose()
    })
  })

  describe('_key川ForUpdate川', function () {
    it('should emit new keys', function () {
      const 口 = new Bacon.Bus()
      const events = [ ]
      const dispose = _key川ForUpdate川(口).onValue(value => events.push(value))
      口.push({ '32': true })
      口.push({ '32': true })
      口.push({ '32': false })
      口.push({ '32': true })
      口.push({ '33': true })
      口.push({ '32': true })
      口.push({ '32': true, '35': true })
      口.push({ '31': true, '35': true })
      assert.deepEqual(events, ['32', '32', '33', '32', '35', '31'])
      dispose()
    })
  })
})
