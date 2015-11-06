
import _ from 'lodash'
import * as Judgments from '../judgments'

export class PlayerStats {
  constructor (notechart) {
    this.totalCombo = _(notechart.notes)
        .map(note => notechart.info(note).combos)
        .sum()
    this.combo = 0
    this.maxCombo = 0
    this.rawSumJudgmentWeight = 0
    this.rawTotalComboScore = this._calculateRawTotalComboScore()
    this.rawSumComboScore = 0
    this.counts = { [Judgments.MISSED]: 0, '1': 0, '2': 0, '3': 0, '4': 0, }
    this.numJudgments = 0
    this.poor = false
    this._log = []
  }
  get score () {
    //#region score
    let accuracyScore = Math.floor(
          this.accuracy * 500000)
    let comboScore = Math.floor(
          this.rawSumComboScore * 55555 / this.rawTotalComboScore)
    return accuracyScore + comboScore
    //#endregion
  }
  get accuracy () {
    return this.rawSumJudgmentWeight / (Judgments.weight(1) * this.totalCombo)
  }
  get currentAccuracy () {
    return (this.rawSumJudgmentWeight /
        (Judgments.weight(1) * this.numJudgments || 1))
  }
  get log () {
    return (
      this._log.map(({ character, count }) =>
        `${count > 1 ? count : ''}${character}`
      )
      .join('')
    )
  }
  handleJudgment (judgment) {
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
    this.counts[judgment] += 1
    this.numJudgments += 1
    this._recordLog(judgment)
  }
  _calculateRawTotalComboScore () {
    var sum = 0
    for (var i = 1; i <= this.totalCombo; i++) {
      sum += this._calculateRawComboScore(i)
    }
    return sum
  }
  _calculateRawComboScore (i) {
    //#region combo
    if (i === 0) return 0
    if (i < 23) return 1
    if (i < 51) return 2
    if (i < 92) return 3
    if (i < 161) return 4
    return 5
    //#endregion
  }
  _recordLog (judgment) {
    let character = this._getLogCharacter(judgment)
    if (character) {
      if (
        this._log.length === 0 ||
        this._log[this._log.length - 1].character !== character
      ) {
        this._log.push({ character, count: 1 })
      } else {
        this._log[this._log.length - 1].count += 1
      }
    }
  }
  _getLogCharacter (judgment) {
    switch (judgment) {
      case 1: return 'A'
      case 2: return 'B'
      case 3: return 'C'
      case 4: return 'D'
      case Judgments.MISSED: return 'M'
    }
  }
}

export default PlayerStats
