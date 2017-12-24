import _ from 'lodash'

export const UNJUDGED = 0
export const MISSED = -1

// #region judgment timegate
const NORMAL_TIMEGATES = [
  { value: 1, timegate: 0.02, endTimegate: 0.04 },
  { value: 2, timegate: 0.05, endTimegate: 0.1 },
  { value: 3, timegate: 0.1, endTimegate: 0.2 },
  { value: 4, timegate: 0.2, endTimegate: 0.2 }
]
const TRANSITIONAL_BEGINNER_LV5_TIMEGATES = [
  { value: 1, timegate: 0.021, endTimegate: 0.042 },
  { value: 2, timegate: 0.06, endTimegate: 0.12 },
  { value: 3, timegate: 0.12, endTimegate: 0.2 },
  { value: 4, timegate: 0.2, endTimegate: 0.2 }
]
const TRANSITIONAL_BEGINNER_LV4_TIMEGATES = [
  { value: 1, timegate: 0.022, endTimegate: 0.044 },
  { value: 2, timegate: 0.07, endTimegate: 0.14 },
  { value: 3, timegate: 0.14, endTimegate: 0.2 },
  { value: 4, timegate: 0.2, endTimegate: 0.2 }
]
const TRANSITIONAL_BEGINNER_LV3_TIMEGATES = [
  { value: 1, timegate: 0.023, endTimegate: 0.046 },
  { value: 2, timegate: 0.08, endTimegate: 0.16 },
  { value: 3, timegate: 0.16, endTimegate: 0.2 },
  { value: 4, timegate: 0.2, endTimegate: 0.2 }
]
const ABSOLUTE_BEGINNER_TIMEGATES = [
  { value: 1, timegate: 0.024, endTimegate: 0.048 },
  { value: 2, timegate: 0.1, endTimegate: 0.18 },
  { value: 3, timegate: 0.18, endTimegate: 0.2 },
  { value: 4, timegate: 0.2, endTimegate: 0.2 }
]
// #endregion

class FixedTimegatesJudge {
  constructor (timegates) {
    this._timegates = timegates
  }
  getTimegates (gameTime, noteTime) {
    return this._timegates
  }
}
class TutorialJudge {
  getTimegates (gameTime, noteTime) {
    if (noteTime < 100) {
      return ABSOLUTE_BEGINNER_TIMEGATES
    } else {
      return NORMAL_TIMEGATES
    }
  }
}

const NORMAL_JUDGE = new FixedTimegatesJudge(NORMAL_TIMEGATES)

export function getJudgeForNotechart (notechart, { tutorial = false }) {
  const info = notechart.songInfo
  const insane = info.difficulty >= 5
  if (tutorial) {
    return new TutorialJudge()
  }
  if (insane) {
    return NORMAL_JUDGE
  }
  if (info.level === 1 || info.level === 2) {
    return new FixedTimegatesJudge(ABSOLUTE_BEGINNER_TIMEGATES)
  }
  if (info.level === 3) {
    return new FixedTimegatesJudge(TRANSITIONAL_BEGINNER_LV3_TIMEGATES)
  }
  if (info.level === 4) {
    return new FixedTimegatesJudge(TRANSITIONAL_BEGINNER_LV4_TIMEGATES)
  }
  if (info.level === 5) {
    return new FixedTimegatesJudge(TRANSITIONAL_BEGINNER_LV5_TIMEGATES)
  }
  return NORMAL_JUDGE
}

/**
 * Takes a gameTime and noteTime and returns the appropriate judgment.
 *
 *  1 - METICULOUS
 *  2 - PRECISE
 *  3 - GOOD
 *  4 - OFFBEAT
 *  0 - (not judge)
 * -1 - MISSED
 */
export function judgeTimeWith (f) {
  return function judgeTimeWithF (gameTime, noteTime, judge = NORMAL_JUDGE) {
    const timegates = judge.getTimegates(gameTime, noteTime)
    let delta = Math.abs(gameTime - noteTime)
    for (let i = 0; i < timegates.length; i++) {
      if (delta < f(timegates[i])) return timegates[i].value
    }
    return gameTime < noteTime ? UNJUDGED : MISSED
  }
}

export const judgeTime = judgeTimeWith(_.property('timegate'))
export const judgeEndTime = judgeTimeWith(_.property('endTimegate'))

export function timegate (judgment, judge = NORMAL_JUDGE) {
  return _.find(judge.getTimegates(null, null), { value: judgment }).timegate
}

export function isBad (judgment) {
  return judgment >= 4
}

export function breaksCombo (judgment) {
  return judgment === MISSED || isBad(judgment)
}

// #region judgment weight
export function weight (judgment) {
  if (judgment === 1) return 100
  if (judgment === 2) return 80
  if (judgment === 3) return 50
  return 0
}
// #endregion
