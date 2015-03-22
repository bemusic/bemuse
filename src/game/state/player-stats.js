
import R from 'ramda'
import * as Judgments from '../judgments'

export class PlayerStats {
  constructor(notechart) {
    this.totalCombo = R.sum(R.map(note => notechart.info(note).combos)(
        notechart.notes))
    this.combo = 0
    this.maxCombo = 0
    this.poor = false
  }
  handleJudgment(judgment) {
    if (Judgments.breaksCombo(judgment)) {
      this.combo = 0
      this.poor = true
    } else {
      this.combo += 1
      this.poor = false
    }
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo
    }
  }
}

export default PlayerStats
