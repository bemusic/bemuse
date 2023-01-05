import { useContext } from 'react'
import { OnlineContext } from './instance'
import { useQuery } from 'react-query'
import { currentUserQueryKey, getPersonalRecordQueryKey } from './queryKeys'

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
