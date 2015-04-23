
import Bacon        from 'baconjs'
import { Store }    from 'bemuse/flux'
import * as Actions from '../actions/collection-actions'

const $server       = Bacon.update(null,
    [Actions.startLoading.bus], (prev, server) => server)

const $collection   = Bacon.update({ loading: true },
    [Actions.startLoading.bus],  () => ({ loading: true }),
    [Actions.finishLoading.bus], (prev, c) =>
        ({ loading: false, collection: c }),
    [Actions.errorLoading.bus],  (prev, e) =>
        ({ loading: false, error: e }))

export default new Store({
  server:     $server,
  collection: $collection,
})
