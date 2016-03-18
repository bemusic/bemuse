
import co from 'co'

import * as Actions from 'bemuse/app/actions/collection-actions'

describe('CollectionActions', function () {
  describe('loadCollection(url)', function () {
    it('should load the collection', co.wrap(function * () {
      Actions.loadCollection('/spec/app/fixtures')
      let onStartLoading = waitForAction(Actions.startLoading)
      let onFinishLoading = waitForAction(Actions.finishLoading)
      expect((yield onStartLoading).value)
          .to.deep.equal({ url: '/spec/app/fixtures' })
      expect((yield onFinishLoading).value.songs)
          .to.be.an.instanceof(Array)
    }))
    it('should call errorLoading when cannot load', co.wrap(function * () {
      Actions.loadCollection('/spec/app/fixtures/nonexistant')
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
