
import R from 'ramda'
import * as Judgments from '../judgments'

// >> game/grading
//
// After playing the game, the grade is calculated according to this table:
//
// =========== ===============
//    Grade      Minimum Score
// =========== ===============
//     F                     0
//     D                300000
//     C                350000
//     B                400000
//     A                450000
//     S                500000
//     SS               520000
//    SSS               530000
//    SSSS              540000
//    SSSSS             550000
//   555555             555555
// =========== ===============

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
    // >> game/scoring
    //
    // The player's score is calculated from this formula:
    //
    // .. math::
    //
    //    \text{score} &= 500000 \times \text{accuracy}
    //      + 55555 \times \text{combo bonus} \\[10pt]
    //    \text{accuracy} &= \frac{
    //      \sum\text{accuracy score}
    //    }{\sum\text{total combos}} \\[10pt]
    //    \text{combo bonus} &= \frac{
    //      \sum_{c \in \text{combos}}{\text{combo weight}(c)}
    //    }{\sum_{i = 1}^{\text{total combos}}{\text{combo level}(i)}} \\[10pt]
    //    \text{combo level}(c) &= \begin{cases}
    //      0 & c = 0 \\
    //      1 & 0 \leq c \le 23 \\
    //      2 & 23 \leq c \le 51 \\
    //      3 & 51 \leq c \le 92 \\
    //      4 & 92 \leq c \le 161 \\
    //      5 & 161 \leq c \le 230 \\
    //      6 & 230 \leq c
    //    \end{cases}
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
    // >>
    // Here's how the combo level formula comes from.
    // Let's assume, for simplicity, a player with 99% hit rate,
    // regardless of difficulty.
    // The probability that the player will attain :math:`c` combos
    // is :math:`0.99^c`.
    //
    // Now we have 6 combo levels.
    // The probability that the player will
    // attain that level gradually decreases.
    // Therefore, the minimum combo is
    // :math:`\left\lceil\log_{0.99} p\right\rceil`.
    //
    // ============ ================= ===========
    //  Combo Level  Max. Probability  Min. Combo
    // ============ ================= ===========
    //            1              100%           1
    //            2               80%          23
    //            3               60%          51
    //            4               40%          92
    //            5               20%         161
    //            6               10%         230
    // ============ ================= ===========
    //
    if (i === 0) return 0
    if (i < 23) return 1
    if (i < 51) return 2
    if (i < 92) return 3
    if (i < 161) return 4
    if (i < 230) return 5
    return 6
  }
}

export default PlayerStats
