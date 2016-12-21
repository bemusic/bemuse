import * as Rx from 'rxjs/Rx'
import { load as loadCollection } from 'bemuse/music-collection'

import performSideEffects from './performSideEffects'

export function createCollectionLoader ({
  onBeginLoading,
  onLoad,
  onErrorLoading,
  fetch
}) {
  const collectionUrl川 = new Rx.Subject()
  const sideEffect川 = (collectionUrl川
    .groupBy(url => url)
    .flatMap(url川 => url川.switchMap(url => Rx.Observable.concat(
      Rx.Observable.of(() => onBeginLoading(url)),
      Rx.Observable.fromPromise(loadCollection(url, { fetch })
        .then(
          data => () => onLoad(url, data),
          error => () => onErrorLoading(url, error)
        )
      )
    )))
  )

  function load (collectionUrl) {
    collectionUrl川.next(collectionUrl)
  }

  return {
    load,
    dispose: performSideEffects(sideEffect川).dispose
  }
}

export default createCollectionLoader
