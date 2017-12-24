
import PlayerAudio from './player-audio'
import { playerWithBMS } from '../test-helpers'

describe('PlayerAudio', function () {
  let player
  let audio
  let waveFactory

  function setup (_player) {
    player = _player
    waveFactory = {
      playAuto: sinon.stub().returns({}),
      playNote: sinon.stub().returns({}),
      playFree: sinon.stub().returns({})
    }
    audio = new PlayerAudio({ player, waveFactory })
  }

  it('should play autokeysounds on correct time', function () {
    setup({
      notechart: {
        autos: [
          { time: 1, keysound: '0x' },
          { time: 2, keysound: '0y' },
          { time: 2, keysound: '0z' }
        ],
        notes: []
      },
      options: {
        autosound: false
      }
    })
    audio.update(0)
    expect(waveFactory.playAuto).to.have.callCount(0)
    audio.update(1)
    expect(waveFactory.playAuto).to.have.callCount(1)
    expect(waveFactory.playAuto).to.have.been.calledWithMatch({ keysound: '0x' })
    audio.update(2)
    expect(waveFactory.playAuto).to.have.callCount(3)
  })

  it('should play notes automatically when autosound is on', function () {
    setup({
      notechart: {
        autos: [ ],
        notes: [
          { time: 1, keysound: '0x' }
        ]
      },
      options: {
        autosound: true
      }
    })
    audio.update(1)
    expect(waveFactory.playNote).to.have.been.calledWithMatch({ keysound: '0x' })
  })

  it('should not play notes automatically when autosound is off', function () {
    setup({
      notechart: {
        autos: [ ],
        notes: [
          { time: 1, keysound: '0x' }
        ]
      },
      options: {
      }
    })
    audio.update(1)
    void expect(waveFactory.playNote).to.not.have.been.called
  })

  it('should play notes ahead of time', function () {
    setup({
      notechart: {
        autos: [ { time: 1, keysound: '0x' } ],
        notes: []
      },
      options: { }
    })
    audio.update(0.999)
    expect(waveFactory.playAuto).to.have.been.calledWithMatch({ keysound: '0x' })
    expect(waveFactory.playAuto.getCall(0).args[1]).to.be.closeTo(0.001, 1e-5)
  })

  it('should play hit notes', function () {
    setup(playerWithBMS())
    audio.update(0.999, {
      notifications: {
        sounds: [
          { note: { keysound: '0x' }, type: 'hit', judgment: 1 }
        ]
      },
      stats: { }
    })
    expect(waveFactory.playNote).to.have.been.calledWithMatch({ keysound: '0x' })
  })

  it('badly hit note should sound off-pitch', function () {
    setup(playerWithBMS())
    let instance = {
      bad: sinon.stub()
    }
    waveFactory.playNote.returns(instance)
    audio.update(0.999, {
      notifications: {
        sounds: [
          { note: { keysound: '0x' }, type: 'hit', judgment: 4 }
        ]
      },
      stats: { }
    })
    void expect(instance.bad).to.have.been.called
  })

  it('should work even without audio', function () {
    setup(playerWithBMS())
    waveFactory.playNote.returns(null)
    audio.update(0.999, {
      notifications: {
        sounds: [
          { note: { keysound: '0x' }, type: 'hit', judgment: 4 }
        ]
      },
      stats: { }
    })
  })

  it('should stop sound when broken', function () {
    setup(playerWithBMS())
    let note = { keysound: '0x' }
    let instance = { stop: sinon.spy() }
    waveFactory.playNote.returns(instance)
    audio.update(0.999, {
      notifications: {
        sounds: [ { note: note, type: 'hit' } ]
      },
      stats: { }
    })
    audio.update(1.100, {
      notifications: {
        sounds: [ { note: note, type: 'break' } ]
      },
      stats: { }
    })
    void expect(instance.stop).to.have.been.called
  })

  it('should play sounds when hitting blank space', function () {
    setup(playerWithBMS())
    audio.update(0.999, {
      notifications: {
        sounds: [
          { note: { keysound: '0x' }, type: 'free' }
        ]
      },
      stats: { }
    })
    expect(waveFactory.playFree).to.have.been.calledWithMatch({ keysound: '0x' })
  })

  it('should play hit note once', function () {
    setup(playerWithBMS())
    let note = { keysound: '0x' }
    audio.update(0.999, {
      notifications: {
        sounds: [ { note: note, type: 'hit' } ]
      },
      stats: { }
    })
    audio.update(1.000, {
      notifications: {
        sounds: [ { note: note, type: 'hit' } ]
      },
      stats: { }
    })
    expect(waveFactory.playNote).to.have.callCount(1)
  })
})
