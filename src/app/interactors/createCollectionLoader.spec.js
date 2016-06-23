
import { createCollectionLoader } from './createCollectionLoader'
import waitUntil from 'bemuse/wait-until'
import assert from 'power-assert'
import co from 'co'

function setup ({ fetch }) {
  const onBeginLoading = sinon.spy()
  const onErrorLoading = sinon.spy()
  const onLoad = sinon.spy()
  const collectionLoader = createCollectionLoader({
    onBeginLoading, onErrorLoading, onLoad, fetch
  })
  return { collectionLoader, onBeginLoading, onErrorLoading, onLoad }
}

describe('createCollectionLoader', () => {
  describe('load(url)', function () {
    it('should load the collection and call `onLoad`', co.wrap(function * () {
      const { collectionLoader, onBeginLoading, onLoad } = setup({
        fetch: (url) => {
          assert(url === '/src/app/test-fixtures/example-music-server/index.json')
          return Promise.resolve({
            json: () => require('../test-fixtures/example-music-server/index.json')
          })
        }
      })
      collectionLoader.load('/src/app/test-fixtures/example-music-server')
      yield waitUntil(() => assert(onLoad.called))
      assert(onBeginLoading.called)
    }))

    it('should load the collection and call `onErrorLoading`', co.wrap(function * () {
      const { collectionLoader, onErrorLoading } = setup({
        fetch: (url) => Promise.reject(new Error('???'))
      })
      collectionLoader.load('/src/app/test-fixtures/example-music-server')
      yield waitUntil(() => assert(onErrorLoading.called))
    }))
  })
})
