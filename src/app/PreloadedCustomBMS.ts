import { getPreloadArchiveFlag } from './query-flags'

let pending: string | null = String(getPreloadArchiveFlag() || '') || null

export function hasPendingArchiveToLoad() {
  return !!pending
}

export function consumePendingArchiveURL() {
  try {
    return pending
  } finally {
    pending = null
  }
}
