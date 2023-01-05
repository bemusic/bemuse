import { useContext } from 'react'
import { OnlineContext } from './instance'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  currentUserQueryKey,
  getLeaderboardQueryKey,
  getPersonalRankingEntryQueryKey,
  getPersonalRecordQueryKey,
} from './queryKeys'
import { MappingMode } from 'bemuse/rules/mapping-mode'
import { ScoreInfo } from '.'

export function useCurrentUser() {
  const online = useContext(OnlineContext)
  return (
    useQuery({
      queryKey: currentUserQueryKey,
      queryFn: () => online.getCurrentUser(),
    }).data || null
  )
}

export function usePersonalRecordsByMd5Query(chart: { md5: string }) {
  const online = useContext(OnlineContext)
  return useQuery({
    queryKey: getPersonalRecordQueryKey(chart.md5),
    queryFn: () => online.getPersonalRecordsByMd5(chart.md5),
  })
}

export function useLeaderboardQuery(
  chart: { md5: string },
  playMode: MappingMode
) {
  const online = useContext(OnlineContext)
  return useQuery({
    queryKey: getLeaderboardQueryKey(chart.md5, playMode),
    queryFn: () => online.scoreboard({ md5: chart.md5, playMode }),
  })
}

export function usePersonalRankingEntryQuery(
  chart: { md5: string },
  playMode: MappingMode
) {
  const online = useContext(OnlineContext)
  return useQuery({
    queryKey: getPersonalRankingEntryQueryKey(chart.md5, playMode),
    queryFn: () =>
      online.retrievePersonalRankingEntry({ md5: chart.md5, playMode }),
  })
}

export function useRecordSubmissionMutation() {
  const online = useContext(OnlineContext)
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (info: ScoreInfo) => {
      return await online.submitScore(info)
    },
    onSuccess: (data, info) => {
      client.setQueryData(
        getPersonalRankingEntryQueryKey(info.md5, info.playMode),
        data
      )
      client.invalidateQueries({
        queryKey: getLeaderboardQueryKey(info.md5, info.playMode),
      })
    },
  })
}
