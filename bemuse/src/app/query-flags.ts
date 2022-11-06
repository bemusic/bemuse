import query from 'bemuse/utils/query'

/**
 * The `?server` parameter specifies a URL to a Bemuse custom music server.
 *
 * @see https://bemuse.ninja/project/docs/music-server.html
 */
export function getMusicServer() {
  return query.BEMUSE_MUSIC_SERVER || query.server
}

/**
 * The `?volume` parameter specifies the sound volume.
 *
 * @see https://bemuse.ninja/project/docs/music-server.html
 */
export function getSoundVolume() {
  return +query.volume || 1
}

/**
 * The `?archive` parameter specifies a URL to a BMS archive file to be downloaded when the player enters the game.
 *
 * @see https://github.com/bemusic/bemuse/pull/568
 * @see https://twitter.com/Nekokan_Server/status/1173186650865713153
 */
export function getPreloadArchiveFlag() {
  return query.archive
}

/**
 * The `?grep` parameter specifies the initials search text to be pre-filled when the player enters the music selection screen.
 */
export function getInitialGrepString() {
  return query.grep
}

/**
 * The `?song` parameter specifies the title of the song to be pre-selected when the player enters the music selection screen.
 */
export function getInitiallySelectedSong() {
  return query.song
}

/**
 * The `?timesynchro-server` parameter allows overriding the default time synchronization server.
 */
export function getTimeSynchroServer() {
  return query.BEMUSE_TIMESYNCHRO_SERVER
}

let flagSet: Set<string> | undefined

/**
 * The `?flags` parameter allows enabling experimental features by specifying a comma-separated list of flags.
 */
export function isQueryFlagEnabled(flagName: string) {
  if (!flagSet) {
    flagSet = new Set(
      String(query.flags || '')
        .split(',')
        .filter(Boolean)
    )
  }
  return flagSet.has(flagName)
}
