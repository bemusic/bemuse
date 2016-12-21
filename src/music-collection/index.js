export const OFFICIAL_SERVER_URL = 'https://music.bemuse.ninja/live'

export function load (url) {
  return fetch(url + '/index.json').then(response => response.json())
}
