import * as Collections from './Collections'
import * as LoadState from './LoadState'

import { given, shouldEqual } from 'circumstance'

describe('Collections', function () {
  it('should receive collection data', () =>
    given(Collections.initialState)
    .when(Collections.beginLoading('https://test-server/'))
    .and(Collections.completeLoading('https://test-server/', { x: 1 }))
    .then(
      Collections.getCollectionByUrl('https://test-server/'),
      LoadState.isCompleted,
      shouldEqual(true)
    )
  )
  it('should allow errors', () =>
    given(Collections.initialState)
    .when(Collections.beginLoading('https://test-server/'))
    .and(Collections.errorLoading('https://test-server/', new Error('oh no')))
    .then(
      Collections.getCollectionByUrl('https://test-server/'),
      LoadState.isError,
      shouldEqual(true)
    )
  )
})
