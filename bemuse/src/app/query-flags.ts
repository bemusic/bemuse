import query from 'bemuse/utils/query'

/**
 * The `?server` flag specifies a URL to a Bemuse custom music server.
 *
 * @see https://bemuse.ninja/project/docs/music-server.html
 */
export function getMusicServer(): string {
  return query.BEMUSE_MUSIC_SERVER || query.server
}

/**
 * The `?volume` flag specifies the sound volume.
 *
 * @see https://bemuse.ninja/project/docs/music-server.html
 */
export function getSoundVolume(): number {
  return +query.volume || 1
}

/**
 * The `?archive` flag specifies a URL to a BMS archive file to be downloaded when the player enters the game.
 *
 * @see https://github.com/bemusic/bemuse/pull/568
 * @see https://twitter.com/Nekokan_Server/status/1173186650865713153
 */
export function getPreloadArchiveFlag(): string | undefined {
  return query.archive
}

/**
 * The `?grep` flag specifies the initials search text to be pre-filled when the player enters the music selection screen.
 */
export function getInitialGrepString(): string | undefined {
  return query.grep
}

/**
 * The `?song` flag specifies the title of the song to be pre-selected when the player enters the music selection screen.
 */
export function getInitiallySelectedSong(): string | undefined {
  return query.song
}

export function getTimeSynchroServer(): string | undefined {
  return query.BEMUSE_TIMESYNCHRO_SERVER
}
