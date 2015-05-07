
import query from 'bemuse/utils/query'

export function shouldShowOptions() {
  return query.BEMUSE_SHOW_OPTIONS === '1'
}

export function shouldEnableBenchmark() {
  return query.BEMUSE_BENCHMARK === '1'
}

export function shouldDisableFullScreen() {
  return query.BEMUSE_NO_FULLSCREEN === '1'
}

export function shouldShowAbout() {
  return query.BEMUSE_SHOW_ABOUT === '1'
}

export function shouldShowModeSelect() {
  return query.BEMUSE_SHOW_MODE_SELECT === '1'
}
