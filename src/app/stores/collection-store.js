
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'
import * as Actions from '../actions/collection-actions'

import { OFFICIAL_SERVER_URL } from '../constants'

const server川 = Bacon.update(null,
  [Actions.startLoading.bus], (prev, server) => server
)

const unofficial川 = server川.map(server =>
  server && server.url !== OFFICIAL_SERVER_URL
)

const collection川 = Bacon.update({ loading: true },
  [Actions.startLoading.bus], () => ({ loading: true }),
  [Actions.finishLoading.bus], (prev, c) => (
    { loading: false, collection: c }
  ),
  [Actions.errorLoading.bus], (prev, e) => (
    { loading: false, error: e }
  )
)

export default new Store({
  server:     server川,
  collection: collection川,
  unofficial: unofficial川,
})
