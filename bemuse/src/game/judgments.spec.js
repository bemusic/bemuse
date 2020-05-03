import { getJudgeForNotechart, judgeTime, timegate } from './judgments'
import { notechart } from './test-helpers'

describe('tutorial song', () => {
  it('beginning is easy', () => {
    const chart = notechart('#PLAYLEVEL 0')
    const judge = getJudgeForNotechart(chart, { tutorial: true })
    expect(judgeTime(9.89, 10, judge)).to.equal(3)
  })
  it('ending is hard', () => {
    const chart = notechart('#PLAYLEVEL 0')
    const judge = getJudgeForNotechart(chart, { tutorial: true })
    expect(judgeTime(109.89, 110, judge)).to.equal(4)
  })
})

describe('beginner timegates', () => {
  it('very easy applied to lv1', () => {
    const chart = notechart('#PLAYLEVEL 1')
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.18)
  })
  it('very easy applied to lv2', () => {
    const chart = notechart('#PLAYLEVEL 2')
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.18)
  })
  it('very easy applied to lv3', () => {
    const chart = notechart('#PLAYLEVEL 3')
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.16)
  })
  it('very easy applied to lv4', () => {
    const chart = notechart('#PLAYLEVEL 4')
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.14)
  })
  it('very easy applied to lv5', () => {
    const chart = notechart('#PLAYLEVEL 5')
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.12)
  })
  it('is not applied for more than lv6', () => {
    const chart = notechart('#PLAYLEVEL 6')
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.1)
  })
})

describe('insane song', () => {
  it('gets normal timing regardless of level', () => {
    const chart = notechart(`
      #PLAYLEVEL 1
      #DIFFICULTY 5
    `)
    const judge = getJudgeForNotechart(chart, {})
    expect(timegate(3, judge)).to.equal(0.1)
  })
})
