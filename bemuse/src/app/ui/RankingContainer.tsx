import { RankingState } from 'bemuse/online'
import {
  useCurrentUser,
  useLeaderboardQuery,
  usePersonalRankingEntryQuery,
  useRecordSubmissionMutation,
} from 'bemuse/online/hooks'
import React, { useEffect, useRef } from 'react'

import { Operation, completed, error, loading } from 'bemuse/online/operations'
import { ScoreCount } from 'bemuse/rules/accuracy'
import { MappingMode } from 'bemuse/rules/mapping-mode'
import { UseMutationResult, UseQueryResult } from 'react-query'
import Ranking from './Ranking'
import { Result } from './ResultScene'

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
  const user = useCurrentUser()
  const leaderboardQuery = useLeaderboardQuery(chart, playMode)
  const personalRankingEntryQuery = usePersonalRankingEntryQuery(
    chart,
    playMode
  )
  const submissionMutation = useRecordSubmissionMutation()
  const canSubmit = !!user && !!result
  const submit = () => {
    if (canSubmit) {
      submissionMutation.mutate({
        md5: chart.md5,
        playMode: playMode,
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
      })
    }
  }
  const state: RankingState = {
    data: leaderboardQuery.data?.data || null,
    meta: {
      submission: user
        ? operationFromResult(
            canSubmit ? submissionMutation : personalRankingEntryQuery
          )
        : { status: 'unauthenticated' },
      scoreboard: operationFromResult(leaderboardQuery as any),
    },
  }
  const submitted = useRef(false)
  useEffect(() => {
    if (!submitted.current && canSubmit) {
      submitted.current = true
      submit()
    }
  }, [canSubmit])
  return (
    <Ranking
      state={state}
      onReloadScoreboardRequest={() => personalRankingEntryQuery.refetch()}
      onResubmitScoreRequest={submit}
    />
  )
}

function operationFromResult<T>(
  result: UseMutationResult<T, any, any, any> | UseQueryResult<T, any>
): Operation<T> {
  if (result.isLoading) {
    return loading()
  }
  if (result.isError) {
    return error(result.error as any)
  }
  return completed(result.data!)
}

export default RankingContainer as FC<RankingContainerProps>
