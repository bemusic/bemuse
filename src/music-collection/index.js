export const OFFICIAL_SERVER_URL = '/music'

export function load (url) {
  return fetch(url + '/index.json').then(response => response.json())
}
