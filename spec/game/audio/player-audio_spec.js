
import PlayerAudio  from 'bemuse/game/audio/player-audio'

describe('PlayerAudio', function() {
  it('should play notes on correct time', function() {
    let player = {
      notechart: {
        autos: [
          { time: 1, keysound: '0x', },
          { time: 2, keysound: '0y', },
          { time: 2, keysound: '0z', },
        ],
      },
    }
    let waveFactory = {
      playAuto: sinon.spy(),
    }
    let audio = new PlayerAudio({ player, waveFactory })
    audio.update(0)
    expect(waveFactory.playAuto).to.have.callCount(0)
    audio.update(1)
    expect(waveFactory.playAuto).to.have.callCount(1)
    expect(waveFactory.playAuto).to.have.been.calledWith('0x')
    audio.update(2)
    expect(waveFactory.playAuto).to.have.callCount(3)
  })
})
