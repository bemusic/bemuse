import { IResources } from './types'
import { URLResources } from './url'

export function resolveRelativeResources(
  base: IResources,
  url: string
): [IResources, string] {
  // Absolute URL
  if (url.includes('://')) {
    return [new URLResources(new URL(url)), url.split('/').slice(-1)[0]]
  }

  const parts = url.split('/')
  let current = base
  while (parts.length > 1) {
    const dirName = parts.shift()!
    current = new DirectoryResources(current, dirName)
  }
  return [current, parts[0]]
}

export class DirectoryResources implements IResources {
  constructor(private base: IResources, private dirName: string) {}

  async file(filename: string) {
    return this.base.file(`${this.dirName}/${filename}`)
  }
}
