import type { MusicServerIndex } from 'bemuse-types'

export const OFFICIAL_SERVER_URL = 'https://music4.bemuse.ninja/server'

export async function load(
  serverUrl: string,
  { fetch = global.fetch } = {}
): Promise<MusicServerIndex> {
  const indexUrl = getServerIndexFileUrl(serverUrl)
  const data = await fetch(indexUrl).then((response) => response.json())

  if (Array.isArray(data.songs)) {
    return data
  }
  if (Array.isArray(data.charts)) {
    // Single-song server
    const lastSlash = indexUrl.lastIndexOf('/')
    const dir =
      lastSlash === -1 ? indexUrl : indexUrl.substring(0, lastSlash + 1)
    return { songs: [{ ...data, id: 'song', path: dir }] }
  }
  throw new Error(
    `Invalid server file at ${indexUrl}: Does not contain "songs" array.`
  )
}

export function getServerIndexFileUrl(serverUrl: string) {
  if (serverUrl.endsWith('/bemuse-song.json')) {
    return serverUrl
  }
  return serverUrl.replace(/\/(?:index\.json)?$/, '') + '/index.json'
}
