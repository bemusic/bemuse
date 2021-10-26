export const OFFICIAL_SERVER_URL = 'https://music.bemuse.ninja/live'

export async function load(serverUrl, { fetch = global.fetch } = {}) {
  const indexUrl = getServerIndexFileUrl(serverUrl)
  const data = await fetch(indexUrl).then((response) => response.json())

  if (Array.isArray(data.songs)) {
    return data
  } else if (Array.isArray(data.charts)) {
    // Single-song server
    const dir = indexUrl.replace(/[^/]*$/, '')
    return { songs: [{ ...data, id: 'song', path: dir }] }
  } else {
    throw new Error(
      `Invalid server file at ${indexUrl}: Does not contain "songs" array.`
    )
  }
}

export function getServerIndexFileUrl(serverUrl) {
  if (serverUrl.endsWith('/bemuse-song.json')) {
    return serverUrl
  }
  return serverUrl.replace(/\/(?:index\.json)?$/, '') + '/index.json'
}
