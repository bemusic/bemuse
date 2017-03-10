
export function getPreviewUrl (serverUrl, song) {
  if (!song) return null
  if (song.tutorial) return null
  return serverUrl + '/' + song.path + '/_bemuse_preview.mp3'
}

export default getPreviewUrl
