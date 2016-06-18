
export default createReducer

export function createReducer (initialState, handlers) {
  return (state = initialState, action) => (handlers[action.type]
    ? handlers[action.type](action)(state)
    : state
  )
}
