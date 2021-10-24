export const OFFICIAL_SERVER_URL = 'https://music.bemuse.ninja/live'

export function load(serverUrl, { fetch = global.fetch } = {}) {
  const indexUrl = getServerIndexFileUrl(serverUrl)
  return fetch(indexUrl).then((response) => response.json())
}

export function getServerIndexFileUrl(serverUrl) {
  return serverUrl.replace(/\/(?:index\.json)?$/, '') + '/index.json'
}
