
import co from 'co'

import * as Actions from './collection-actions'

describe('CollectionActions', function () {
  describe('loadCollection(url)', function () {
    it('should load the collection', co.wrap(function * () {
      Actions.loadCollection('/src/app/test-fixtures/example-music-server')
      let onStartLoading = waitForAction(Actions.startLoading)
      let onFinishLoading = waitForAction(Actions.finishLoading)
      expect((yield onStartLoading).value)
          .to.deep.equal({ url: '/src/app/test-fixtures/example-music-server' })
      expect((yield onFinishLoading).value.songs)
          .to.be.an.instanceof(Array)
    }))
    it('should call errorLoading when cannot load', co.wrap(function * () {
      Actions.loadCollection('/src/app/test-fixtures/nonexistant')
      yield waitForAction(Actions.errorLoading)
    }))
  })
})

function waitForAction (action) {
  return new Promise((resolve) => {
    let unsubscribe = action.bus.onValue((value) => {
      unsubscribe()
      resolve({ value })
    })
  })
}
