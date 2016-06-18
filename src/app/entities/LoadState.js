// An entity that represents something that can have a loading state.
import u from 'updeep'

export const initLoading = () => ({ status: 'loading' })

export const beginLoading = (state) => initLoading()

export const completeWithValue = (value) => u({
  status: 'completed',
  value: () => value
})

export const errorWithReason = (error) => u({
  status: 'error',
  error: () => error
})

export const isLoading = (state) => state.status === 'loading'
export const isCompleted = (state) => state.status === 'completed'
export const isError = (state) => state.status === 'error'
export const value = (state) => state.value
export const error = (state) => state.error
