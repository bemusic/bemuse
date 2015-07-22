
import { Parse }    from 'parse'
import Online       from './index'
import config       from 'val?cacheable!./config'

export let instance = null

if (config.PARSE_APP_ID && config.PARSE_API_KEY) {
  Parse.initialize(
    config.PARSE_APP_ID,
    config.PARSE_API_KEY
  )
  instance = new Online()
} else {
  console.warn('Warning: No Parse API keys specified. Online functionalities wilt not work.')
}

export default instance
