export type PreviewState = {
  currentTime: number
  hiSpeed: number
}

export type PreviewAction = {
  speedUp?: boolean
  speedDown?: boolean
}

export function previewStateReducer(
  state: PreviewState,
  action: PreviewAction
) {
  let nextState = state
  if (action.speedUp) {
    nextState = {
      ...state,
      hiSpeed: +Math.min(state.hiSpeed + 0.1, 99).toFixed(1),
    }
  }
  if (action.speedDown) {
    nextState = {
      ...state,
      hiSpeed: +Math.max(state.hiSpeed - 0.1, 0.1).toFixed(1),
    }
  }
  return nextState
}
