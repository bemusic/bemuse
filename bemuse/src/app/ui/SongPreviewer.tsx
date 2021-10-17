import { Song } from 'bemuse/collection-model/types'
import MusicSelectPreviewer from 'bemuse/music-previewer/MusicSelectPreviewer'
import React, { useEffect, useState } from 'react'
import getPreviewResourceUrl from 'bemuse/music-collection/getPreviewResourceUrl'

export default function SongPreviewer(props: {
  song: Song
  serverUrl: string
}) {
  const { song, serverUrl } = props
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
