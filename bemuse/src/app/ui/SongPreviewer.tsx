import MusicSelectPreviewer from 'bemuse/music-previewer/MusicSelectPreviewer'
import getPreviewResourceUrl from 'bemuse/music-collection/getPreviewResourceUrl'
import React, { useEffect, useState } from 'react'
import { Song } from 'bemuse/collection-model/types'

export default function SongPreviewer({
  song,
  serverUrl,
}: {
  song: Song
  serverUrl: string
}) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    getPreviewResourceUrl(song, serverUrl)
      .then((url) => setUrl(url))
      .catch((error) => {
        console.error(error)
        setUrl(null)
      })
  }, [song, serverUrl])
  return <MusicSelectPreviewer url={url} />
}
