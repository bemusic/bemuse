export function addUnprefixed(
  prefix: string,
  name: string,
  callback: (path: string) => void
) {
  if (name.match(/\.(?:bms|bme|bml|bmson)/i)) {
    callback(name)
    return
  }
  const parts = (prefix + name).split('/')
  for (let i = 0; i < parts.length; i++) {
    callback(parts.slice(i).join('/'))
  }
}
