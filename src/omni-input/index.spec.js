
import { OmniInput, getName, key川, _key川ForUpdate川 } from './'
import { EventEmitter } from 'events'
import assert from 'power-assert'
import Bacon from 'baconjs'


function fakeWindow () {
  const events = new EventEmitter()
  const gamepads = [ ]
  const noop = () => { }
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
      events.emit('keydown', { which: keyCode, preventDefault: noop })
    },
    keyup (keyCode) {
      events.emit('keyup', { which: keyCode, preventDefault: noop })
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
    this.midi口 = new Bacon.Bus()
    this.input = new OmniInput(this.window, {
      getMidi川: () => this.midi口
    })
    this.midi = (...args) => {
      this.midi口.push({
        data: args,
        target: { id: '1234' },
      })
    }
  })

  afterEach(function () {
    this.input.dispose()
  })

  it('does not fail when browser support is limited', () => {
    const basicWindow = {
      addEventListener () { },
      removeEventListener () { },
      navigator: { },
    }
    const input = new OmniInput(basicWindow)
    void input
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
  })

  describe('midi', function () {
    it('handles notes', function () {
      this.midi(0x92, 0x40, 0x7F)
      assert(this.input.update()['midi.1234.2.note.64'], 'note on')
      this.midi(0x82, 0x40, 0x7F)
      assert(!this.input.update()['midi.1234.2.note.64'], 'note off')
      this.midi(0x92, 0x40, 0x7F)
      assert(this.input.update()['midi.1234.2.note.64'], 'note on')
      this.midi(0x92, 0x40, 0x00)
      assert(!this.input.update()['midi.1234.2.note.64'], 'note off with note on')
    })
    it('handles pitch bend', function () {
      this.midi(0xE1, 0x7F, 0x7F)
      assert(this.input.update()['midi.1234.1.pitch.up'])
      assert(!this.input.update()['midi.1234.1.pitch.down'])
      this.midi(0xE1, 0x7F, 0x1F)
      assert(this.input.update()['midi.1234.1.pitch.down'])
      assert(!this.input.update()['midi.1234.1.pitch.up'])
    })
    it('handles sustain pedal', function () {
      this.midi(0xBC, 0x40, 0x7F)
      assert(this.input.update()['midi.1234.12.sustain'])
      this.midi(0xBC, 0x40, 0x00)
      assert(!this.input.update()['midi.1234.12.sustain'])
    })
    it('handles modulation lever', function () {
      this.midi(0xBC, 0x01, 0x7F)
      assert(this.input.update()['midi.1234.12.mod'])
      this.midi(0xBC, 0x01, 0x00)
      assert(!this.input.update()['midi.1234.12.mod'])
    })
    it('returns the key name', function () {
      assert(getName('midi.1234.12.note.60').match(/C4/))
      assert(getName('midi.1234.12.pitch.up').match(/Pitch\+/))
      assert(getName('midi.1234.12.pitch.down').match(/Pitch\-/))
      assert(getName('midi.1234.12.sustain').match(/Sustain/))
      assert(getName('midi.1234.12.mod').match(/Mod/))
    })
  })

  describe('key川', function () {
    it('should return events', function () {
      let last
      const dispose = key川(this.input, this.window).onValue(value => (last = value))

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
