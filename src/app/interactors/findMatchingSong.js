// Finds a song matching the title

function findMatchingSong ({ songs, title, getTitle }) {
  for (const song of songs) {
    if (titleFullyMatches(getTitle(song), title)) {
      return song
    }
  }
}

function titleFullyMatches (haystack, needle) {
  return (
    String(haystack)
      .toLowerCase()
      .trim() ===
    String(needle)
      .toLowerCase()
      .trim()
  )
}

export default findMatchingSong
