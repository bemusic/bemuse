
import { Store }    from 'bemuse/flux'
import reduxState川 from '../redux/reduxState川'
import * as ReduxState from '../redux/ReduxState'
import * as LoadState from '../entities/LoadState'

import { OFFICIAL_SERVER_URL } from '../constants'

const server川 = (reduxState川
  .map(ReduxState.selectCurrentCollectionUrl)
  .map(url => ({ url }))
)

const unofficial川 = server川.map(server =>
  server && server.url !== OFFICIAL_SERVER_URL
)

const collection川 = (reduxState川
  .map(ReduxState.selectCurrentCollection)
  .map(current => {
    if (!current) return { loading: true }
    if (LoadState.isLoading(current)) return { loading: true }
    if (LoadState.isError(current)) return { loading: false, error: LoadState.error(current) }
    return { loading: false, collection: LoadState.value(current) }
  })
)

export default new Store({
  server:     server川,
  collection: collection川,
  unofficial: unofficial川,
})
