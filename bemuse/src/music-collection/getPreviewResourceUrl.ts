import { Song } from 'bemuse/collection-model/types'
import { getSongResources } from './getSongResources'

export default async function getPreviewResourceUrl(
  song: Song,
  serverUrl: string
) {
  if (!song) return null
  if (song.tutorial) return null
  const { baseResources } = getSongResources(song, serverUrl)
  const file = await baseResources.file(
    song.preview_url || '_bemuse_preview.mp3'
  )
  return file.resolveUrl()
}
