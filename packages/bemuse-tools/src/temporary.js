
import temp     from 'temp'
import { join } from 'path'
temp.track()

let dir = null
let id = 0

export function tmp() {
  if (dir === null) dir = temp.mkdirSync()
  id += 1
  return join(dir, '' + id)
}

export default tmp
