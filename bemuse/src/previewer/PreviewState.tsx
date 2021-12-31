export type PreviewState = {
  currentTime: number
  hiSpeed: number
  playing: boolean
}

export type PreviewAction = {
  speedUp?: boolean
  speedDown?: boolean
  play?: boolean
  playFinish?: boolean
  updateTime?: { time: number }
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
  if (action.play) {
    nextState = {
      ...state,
      playing: true,
    }
  }
  if (action.playFinish) {
    nextState = {
      ...state,
      playing: false,
    }
  }
  if (action.updateTime) {
    nextState = {
      ...state,
      currentTime: action.updateTime.time,
    }
  }
  return nextState
}
