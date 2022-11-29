import { AnyAction, Dispatch } from 'redux'
import { Song } from 'bemuse/collection-model/types'
import { getSongResources } from 'bemuse/music-collection/getSongResources'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import {
  currentSongReadmeSlice,
  selectCurrentCollectionUrl,
} from '../redux/ReduxState'

export function useReadme(song: Song): string | null {
  const dispatch = useDispatch()
  const [readme, setReadme] = useState<string | null>(null)
  const collectionUrl = useSelector(selectCurrentCollectionUrl)

  useEffect(() => {
    requestReadmeForUrl(collectionUrl, song, dispatch)
      .then(setReadme)
      .catch(console.error)
  }, [collectionUrl, song])

  return readme
}

async function requestReadmeForUrl(
  serverUrl: string,
  song: Song,
  dispatch: Dispatch<AnyAction>
): Promise<string> {
  dispatch(currentSongReadmeSlice.actions.README_LOADING_STARTED())
  try {
    const resources = getSongResources(song, serverUrl)
    const readme = song.readme
      ? await resources.baseResources
          .file(song.readme)
          .then((f) => f.read())
          .then((ab) => new Blob([ab], { type: 'text/plain' }).text())
      : ''
    const text = stripFrontMatter(readme)
    dispatch(currentSongReadmeSlice.actions.README_LOADED({ text }))
    return text
  } catch (e) {
    dispatch(
      currentSongReadmeSlice.actions.README_LOADING_ERRORED({
        url: song.readme,
      })
    )
    throw e
  }
}

function stripFrontMatter(text: string) {
  return text.replace(/\r\n|\r|\n/g, '\n').replace(/^---\n[\s\S]*?\n---/, '')
}
