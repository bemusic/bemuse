import * as bmson from 'bmson'
import * as BMS from 'bms'

import Notechart from '../'
import { PlayerOptions, NotechartInput, ExpertJudgmentWindow } from '../types'
import { Bmson } from 'bmson/lib/types'

export function load(source: string, playerOptions: PlayerOptions) {
  const data = JSON.parse(source)
  const songInfo = bmson.songInfoForBmson(data)
  const score = bmson.musicalScoreForBmson(data, {
    double: playerOptions.double,
  })
  const barLines = bmson.barLinesForBmson(data)

  const stuff: NotechartInput = {
    notes: score.notes.all(),
    timing: score.timing,
    keysounds: score.keysounds,
    songInfo,
    positioning: new BMS.Positioning([{ t: 0, x: 0, dx: 1, inclusive: true }]),
    spacing: new BMS.Spacing([]),
    barLines,
    images: {
      // HACK: Hardcoded here, probably should belong in bmson package
      eyecatch: data.info.eyecatch_image,
      background: data.info.back_image,
    },
    expertJudgmentWindow: getExpertJudgmentWindowForBmson(data),
  }

  return new Notechart(stuff, playerOptions)
}

function getExpertJudgmentWindowForBmson(data: Bmson): ExpertJudgmentWindow {
  const judgeRank =
    (() => {
      if (!data.info) return 100
      if (!data.info.judge_rank) return 100
      return +data.info.judge_rank || 100
    })() / 100
  return [18 * judgeRank, 40 * judgeRank]
}
