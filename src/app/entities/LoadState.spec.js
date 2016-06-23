import * as LoadState from './LoadState'

import { given, shouldEqual } from 'circumstance'

describe('LoadState', function () {
  it('initLoading should be loading', () =>
    given(LoadState.initLoading())
    .then(LoadState.isLoading, shouldEqual(true))
  )
  it('completeWithValue should turn it into completed', () =>
    given(LoadState.initLoading())
    .when(LoadState.completeWithValue(99))
    .then(LoadState.isCompleted, shouldEqual(true))
    .and(LoadState.value, shouldEqual(99))
  )
  it('errorWithReason should turn it into error', () =>
    given(LoadState.initLoading())
    .when(LoadState.errorWithReason(new Error('x')))
    .then(LoadState.isCompleted, shouldEqual(false))
    .and(LoadState.isError, shouldEqual(true))
    .and(LoadState.error, errorMessage, shouldEqual('x'))
  )
})

const errorMessage = error => error.message
