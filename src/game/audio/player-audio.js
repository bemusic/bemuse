
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
    let notechart = player.notechart
    console.log(player.notechart)
    this._waveFactory = waveFactory ||
        new WaveFactory(master, samples, notechart.keysounds)
    this._autos       = autoplayer(notechart.autos)
    this._notes       = autoplayer(notechart.notes)
  }
  update(time) {
    for (let auto of this._autos.next(time + 1 / 30)) {
      this._waveFactory.playAuto(auto.keysound, auto.time - time)
    }
    for (let note of this._notes.next(time + 1 / 30)) {
      this._waveFactory.playAuto(note.keysound, note.time - time)
    }
  }
}

export default PlayerAudio
