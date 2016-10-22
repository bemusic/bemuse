
export function getGauge (gaugeType) {
  if (gaugeType === 'hope') {
    return hopeGauge()
  }
  return nullGauge()
}

function nullGauge () {
  return {
    update () {
    },
    shouldDisplay () {
      return false
    },
    getPrimary () {
      return 0
    },
    getSecondary () {
      return 0
    }
  }
}

function hopeGauge () {
  let primary
  let secondary
  return {
    update (playerState) {
      const stats = playerState.stats
      const maxPossibleScore = stats.maxPossibleScore
      const realHope = Math.max(0, maxPossibleScore - 500000) / 55555
      const progress = stats.numJudgments / stats.totalCombo
      const hopeS = Math.min(1, realHope * (progress * progress + 0.75 * progress + 0.25))
      primary = hopeS
      if (hopeS > 0) {
        secondary = 0
      } else {
        const realHopeA = Math.max(0, maxPossibleScore - 450000) / 50000
        const hopeA = Math.min(1, realHopeA * (0.67 * progress * progress + 0.33 * progress))
        secondary = hopeA
      }
    },
    shouldDisplay () {
      return primary > 0 || secondary > 0
    },
    getPrimary () {
      return primary
    },
    getSecondary () {
      return secondary
    }
  }
}
