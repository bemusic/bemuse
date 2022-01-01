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
  jumpBySeconds?: { direction: number }
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
      hiSpeed: +Math.min(state.hiSpeed + 0.25, 99).toFixed(2),
    }
  }
  if (action.speedDown) {
    nextState = {
      ...state,
      hiSpeed: +Math.max(state.hiSpeed - 0.25, 0.25).toFixed(2),
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
  if (action.jumpBySeconds) {
    nextState = {
      ...state,
      currentTime: Math.max(
        0,
        state.currentTime + action.jumpBySeconds.direction
      ),
      playing: false,
    }
  }
  return nextState
}
