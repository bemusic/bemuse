
import R from 'ramda'
import * as Judgments from '../judgments'

export class PlayerStats {
  constructor(notechart) {
    this.totalCombo = R.sum(R.map(note => notechart.info(note).combos)(
        notechart.notes))
    this.combo = 0
    this.maxCombo = 0
  }
  handleJudgment(judgment) {
    if (Judgments.breaksCombo(judgment)) {
      this.combo = 0
    } else {
      this.combo += 1
    }
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo
    }
  }
}

export default PlayerStats
