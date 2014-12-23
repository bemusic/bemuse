
import { join, dirname } from 'path'

export let path = join.bind(null, dirname(__dirname))
export default path

