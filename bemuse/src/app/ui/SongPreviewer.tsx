import { getSongResources } from 'bemuse/music-collection/getSongResources'
import { Song } from 'bemuse/collection-model/types'
import getPreviewUrl from 'bemuse/music-collection/getPreviewUrl'
import MusicSelectPreviewer from 'bemuse/music-previewer/MusicSelectPreviewer'
import React, { useEffect, useState } from 'react'

export default function SongPreviewer(props: {
  song: Song
  serverUrl: string
}) {
  const { song, serverUrl } = props
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    getPreviewResource(song, serverUrl)
      .then((url) => setUrl(url))
      .catch((error) => {
        console.error(error)
        setUrl(null)
      })
  }, [song, serverUrl])
  return <MusicSelectPreviewer url={url} />
}

async function getPreviewResource(song: Song, serverUrl: string) {
  if (!song) return null
  if (song.tutorial) return null
  const { baseResources } = getSongResources(song, serverUrl)
  const file = await baseResources.file(
    song.preview_url || '_bemuse_preview.mp3'
  )
  return file.resolveUrl()
}
