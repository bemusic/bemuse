import { RankingState, RankingStream } from 'bemuse/online'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { MappingMode } from 'bemuse/rules/mapping-mode'
import { OnlineContext } from 'bemuse/online/instance'
import Ranking from './Ranking'
import { Result } from './ResultScene'
import { ScoreCount } from 'bemuse/rules/accuracy'

export interface RankingContainerProps {
  chart: { md5: string }
  playMode: MappingMode
  result?: Result
}

export const RankingContainer = ({
  chart,
  playMode,
  result,
}: RankingContainerProps) => {
  const online = useContext(OnlineContext)
  const [state, setState] = useState<RankingState>({
    data: null,
    meta: {
      scoreboard: { status: 'loading' },
      submission: { status: 'loading' },
    },
  })
  const model = useRef<RankingStream | null>(null)
  useEffect(() => {
    const onStoreTrigger = () => setState((s) => ({ ...s }))
    const params = {
      md5: chart.md5,
      playMode: playMode,
      ...(result
        ? {
            score: result.score,
            combo: result.maxCombo,
            total: result.totalCombo,
            count: [
              result['1'],
              result['2'],
              result['3'],
              result['4'],
              result.missed,
            ] as ScoreCount,
            log: result.log,
          }
        : {}),
    }
    model.current = online.Ranking(params)
    const subscription = model.current.state川.subscribe(onStoreTrigger)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const onReloadScoreboardRequest = () => {
    model.current?.reloadScoreboard()
  }

  const onResubmitScoreRequest = () => {
    model.current?.resubmit()
  }

  return (
    <Ranking
      state={state}
      onReloadScoreboardRequest={onReloadScoreboardRequest}
      onResubmitScoreRequest={onResubmitScoreRequest}
    />
  )
}

export default RankingContainer
