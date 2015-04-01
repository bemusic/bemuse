
import R from 'ramda'
import * as Judgments from '../judgments'

export class PlayerStats {
  constructor(notechart) {
    this.totalCombo = R.sum(R.map(note => notechart.info(note).combos)(
        notechart.notes))
    this.combo = 0
    this.maxCombo = 0
    this.rawSumJudgmentWeight = 0
    this.rawTotalComboScore = this._calculateRawTotalComboScore()
    this.rawSumComboScore = 0
    this.poor = false
  }
  get score() {
    let total = Judgments.weight(1) * this.totalCombo
    let accuracyScore = Math.floor(
          this.rawSumJudgmentWeight * 500000 / total)
    let comboScore = Math.floor(
          this.rawSumComboScore * 55555 / this.rawTotalComboScore)
    return accuracyScore + comboScore
  }
  handleJudgment(judgment) {
    if (Judgments.breaksCombo(judgment)) {
      this.combo = 0
      this.poor = true
    } else {
      this.combo += 1
      this.rawSumComboScore += this._calculateRawComboScore(this.combo)
      this.poor = false
    }
    this.rawSumJudgmentWeight += Judgments.weight(judgment)
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo
    }
  }
  _calculateRawTotalComboScore() {
    var sum = 0
    for (var i = 1; i <= this.totalCombo; i ++) {
      sum += this._calculateRawComboScore(i)
    }
    return sum
  }
  _calculateRawComboScore(i) {
    return Math.floor(Math.sqrt(i))
  }
}

export default PlayerStats
