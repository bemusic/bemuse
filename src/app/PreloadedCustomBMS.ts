import { getPreloadArchiveFlag } from './query-flags'

let pending: string | null = String(getPreloadArchiveFlag() || '') || null

/**
 * Returns `true` if there is a pending archive to be downloaded.
 *
 * @see https://github.com/bemusic/bemuse/pull/568
 */
export function hasPendingArchiveToLoad() {
  return !!pending
}

/**
 * Returns the URL to the pending archive to be downloaded.
 * This function can be called once.
 * After the URL is consumed, the pending URL is cleared.
 *
 * @see https://github.com/bemusic/bemuse/pull/568
 */
export function consumePendingArchiveURL() {
  try {
    return pending
  } finally {
    pending = null
  }
}
