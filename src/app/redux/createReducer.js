export default createReducer

export function createReducer (initialState, handlers) {
  return (state = initialState, action) => {
    const nextState = handlers[action.type]
      ? handlers[action.type](action)(state)
      : state
    return nextState
  }
}
