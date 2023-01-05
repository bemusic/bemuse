import { QueryKey } from 'react-query'

export const currentUserQueryKey: QueryKey = ['online', 'currentUser']

export const getPersonalRecordQueryKey: (md5: string) => QueryKey = (md5) => [
  'online',
  'personalRecord',
  md5,
]
