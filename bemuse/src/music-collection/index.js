export const OFFICIAL_SERVER_URL = 'https://music.bemuse.ninja/live'

export function load(url, { fetch = global.fetch } = {}) {
  const indexUrl = url.replace(/\/$/, '') + '/index.json'
  return fetch(indexUrl).then((response) => response.json())
}
