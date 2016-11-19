import * as Judgments from '../judgments'

import _ from 'lodash'

const getAccuracyScore = (accuracy) => Math.floor(accuracy * 500000)
const getComboScore = (sum, total) => Math.floor(sum * 55555 / total)

export class PlayerStats {
  constructor (notechart) {
    this.totalCombo = _(notechart.notes)
        .map(note => notechart.info(note).combos)
        .sum()
    this.totalNotes = notechart.notes.length
    this.combo = 0
    this.maxCombo = 0
    this.rawSumJudgmentWeight = 0
    this.rawTotalComboScore = this._calculateRawTotalComboScore(this.totalCombo)
    this._remainingMaxPossibleRawComboScore = this.rawTotalComboScore
    this.rawSumComboScore = 0
    this.counts = { [Judgments.MISSED]: 0, '1': 0, '2': 0, '3': 0, '4': 0, }
    this.numJudgments = 0
    this.poor = false
    this._log = [ ]
    this.deltas = [ ]
  }
  get score () {
    //#region score
    return this.accuracyScore + this.comboScore
    //#endregion
  }
  get accuracyScore () {
    return getAccuracyScore(this.accuracy)
  }
  get comboScore () {
    return getComboScore(this.rawSumComboScore, this.rawTotalComboScore)
  }
  get maxPossibleScore () {
    return this.maxPossibleAccuracyScore + this.maxPossibleComboScore
  }
  get maxPossibleAccuracyScore () {
    const remainingJudgments = this.totalCombo - this.numJudgments
    const maxPossibleRawWeight = this.rawSumJudgmentWeight + Judgments.weight(1) * remainingJudgments
    const maxPossibleAccuracy = maxPossibleRawWeight / (Judgments.weight(1) * this.totalCombo)
    return getAccuracyScore(maxPossibleAccuracy)
  }
  get maxPossibleComboScore () {
    const maxPossibleRawComboScore = (
      this.rawSumComboScore + this._remainingMaxPossibleRawComboScore
    )
    return getComboScore(maxPossibleRawComboScore, this.rawTotalComboScore)
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
    this.counts[judgment] += 1
    this.numJudgments += 1
    if (Judgments.breaksCombo(judgment)) {
      const remainingJudgments = this.totalCombo - this.numJudgments
      this.combo = 0
      this.poor = true
      this._remainingMaxPossibleRawComboScore = this._calculateRawTotalComboScore(remainingJudgments)
    } else {
      this.combo += 1
      const rawComboScore = this._calculateRawComboScore(this.combo)
      this.rawSumComboScore += rawComboScore
      this._remainingMaxPossibleRawComboScore -= rawComboScore
      this.poor = false
    }
    this.rawSumJudgmentWeight += Judgments.weight(judgment)
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo
    }
    this._recordLog(judgment)
  }
  handleDelta (delta) {
    this.deltas.push(delta)
  }
  _calculateRawTotalComboScore (total) {
    let sum = 0
    for (let i = 1; i <= total; i++) {
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
