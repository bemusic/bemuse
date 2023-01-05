import { useContext } from 'react'
import { OnlineContext } from './instance'
import { useQuery } from 'react-query'
import { currentUserQueryKey } from './queryKeys'

export function useCurrentUser() {
  const online = useContext(OnlineContext)
  return (
    useQuery({
      queryKey: currentUserQueryKey,
      queryFn: () => online.getCurrentUser(),
    }).data || null
  )
}
