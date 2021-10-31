// An entity that represents something that can have a loading state.
import produce from "immer"

// Initializers
export const initLoading = () => ({ status: 'loading' })
export const initCompletedWithValue = (value) => ({
  status: 'completed',
  value,
})

// Queries
export const isLoading = (state) => state.status === 'loading'
export const isCompleted = (state) => state.status === 'completed'
export const isError = (state) => state.status === 'error'
export const value = (state) => state.value
export const error = (state) => isError(state) && state.error

// State Updaters
export const beginLoading = (state) => initLoading()

export const completeWithValue = (value) =>
  produce((draft) => {
    draft.status = 'completed'
    draft.value = value
  })

export const errorWithReason = (error) =>
  produce((draft) => {
    draft.status = 'completed'
    draft.value = value
  })
