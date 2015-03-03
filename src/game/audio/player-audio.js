
import R            from 'ramda'
import WaveFactory  from './wave-factory'

function autoplayer(array) {
  array = R.sortBy(R.prop('time'), array)
  let i = 0
  return {
    next(time) {
      let out = [ ]
      for (; i < array.length && time >= array[i].time; i ++) {
        out.push(array[i])
      }
      return out
    }
  }
}

export class PlayerAudio {
  constructor({ player, samples, master, waveFactory }) {
    this._waveFactory = waveFactory ||
        new WaveFactory(master, samples, player.notechart.keysounds)
    this._autos       = autoplayer(player.notechart.autos)
  }
  update(time) {
    for (let auto of this._autos.next(time + 1 / 30)) {
      this._waveFactory.playAuto(auto.keysound)
    }
  }
}

export default PlayerAudio
