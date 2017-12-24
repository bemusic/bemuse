import u from 'updeep'

// Initializers
export const initWithText = text => ({
  staged: text,
  committed: text
})

// Default initial state
export const initialState = initWithText('')

// Queries
export const searchText = state => state.committed
export const inputText = state => state.staged

// Updaters
export const handleTextType = text => u({ staged: text })
export const handleDebounce = state => ({ ...state, committed: state.staged })
export const setText = text => () => initWithText(text)
