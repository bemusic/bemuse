// An entity that represents something that can have a loading state.

export type Loading = {
  status: 'loading'
}

export type LoadError = {
  status: 'error'
  error: Error
}

export type Completed<V> = {
  status: 'completed'
  value: V
}

export type LoadState<V> = Loading | LoadError | Completed<V>

export const initLoading = <V>(): LoadState<V> => ({ status: 'loading' })
export const initCompletedWithValue = <V>(value: V): LoadState<V> => ({
  status: 'completed',
  value,
})

// Queries
export const isLoading = <V>(state: LoadState<V>): state is Loading =>
  state.status === 'loading'
export const isCompleted = <V>(state: LoadState<V>): state is Completed<V> =>
  state.status === 'completed'
export const isError = <V>(state: LoadState<V>): state is LoadError =>
  state.status === 'error'
export const value = <V>(state: LoadState<V>) =>
  isCompleted(state) && state.value
export const error = <V>(state: LoadState<V>) => isError(state) && state.error

// State Updaters
export const beginLoading =
  <V>() =>
  () =>
    initLoading<V>()

export const completeWithValue =
  <V>(value: V) =>
  (): Completed<V> => ({
    status: 'completed',
    value: value,
  })

export const errorWithReason = (error: Error) => (): LoadError => ({
  status: 'error',
  error: error,
})
