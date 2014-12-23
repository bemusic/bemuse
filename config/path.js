
import { join, dirname } from 'path'

export let path = (...segments) => join(dirname(__dirname), ...segments)
export default path

