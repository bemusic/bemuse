import { MappingMode } from 'bemuse/rules/mapping-mode'
import { QueryKey } from 'react-query'

export const rootQueryKey: QueryKey = ['online']

export const currentUserQueryKey: QueryKey = ['online', 'currentUser']

export const getPersonalRecordQueryKey: (md5: string) => QueryKey = (md5) => [
  'online',
  'personalRecord',
  md5,
]

export const getLeaderboardQueryKey: (
  md5: string,
  playMode: MappingMode
) => QueryKey = (md5, playMode) => ['online', 'leaderboard', md5, playMode]

export const getPersonalRankingEntryQueryKey: (
  md5: string,
  playMode: MappingMode
) => QueryKey = (md5, playMode) => [
  'online',
  'personalRankingEntry',
  md5,
  playMode,
]
