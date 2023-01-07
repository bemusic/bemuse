// Finds a song matching the title

import type { SongMetadataInCollection } from 'bemuse-types'

function findMatchingSong({
  songs,
  title,
  getTitle,
}: {
  songs: readonly SongMetadataInCollection[]
  title: string
  getTitle: (song: SongMetadataInCollection) => string
}) {
  return songs.find((song) => titleFullyMatches(getTitle(song), title))
}

function titleFullyMatches(haystack: string, needle: string) {
  return haystack.toLowerCase().trim() === needle.toLowerCase().trim()
}

export default findMatchingSong
