import { NotechartPreview } from './NotechartPreview'

export type PreviewState = {
  currentTime: number
  hiSpeed: number
  playing: boolean
}

export type PreviewAction = {
  loaded?: boolean
  speedUp?: boolean
  speedDown?: boolean
  play?: boolean
  pause?: boolean
  playPause?: boolean
  home?: boolean
  playFinish?: boolean
  updateTime?: { time: number }
  jumpToTime?: { time: number }
  jumpByMeasure?: { preview: NotechartPreview; direction: number }
}

export function previewStateReducer(
  state: PreviewState,
  action: PreviewAction
) {
  let nextState = state
  if (action.loaded) {
    nextState = {
      ...state,
      playing: false,
    }
  }
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
  if (action.pause) {
    nextState = {
      ...state,
      playing: false,
    }
  }
  if (action.playPause) {
    nextState = {
      ...state,
      playing: !state.playing,
    }
  }
  if (action.playFinish) {
    nextState = {
      ...state,
      playing: false,
    }
  }
  if (action.home) {
    nextState = {
      ...state,
      playing: false,
      currentTime: 0,
    }
  }
  if (action.updateTime) {
    nextState = {
      ...state,
      currentTime: action.updateTime.time,
    }
  }
  if (action.jumpToTime) {
    nextState = {
      ...state,
      currentTime: action.jumpToTime.time,
      playing: false,
    }
  }
  if (action.jumpByMeasure) {
    nextState = {
      ...state,
      currentTime: action.jumpByMeasure.preview.getMeasureJumpTarget(
        state.currentTime,
        action.jumpByMeasure.direction
      ),
      playing: false,
    }
  }
  return nextState
}
