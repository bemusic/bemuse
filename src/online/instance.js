import OfflineService from './offline-service'
import Online         from './index'
import OnlineService  from './online-service'
import { Parse }      from 'parse'
import config         from 'val-loader?cacheable!./config'

export let instance = null

if (config.PARSE_APP_ID && config.PARSE_API_KEY) {
  Parse.initialize(
    config.PARSE_APP_ID,
    config.PARSE_API_KEY
  )
  instance = new Online(new OnlineService())
} else {
  console.warn('Warning: No Parse API keys specified. Online functionalities wilt not work.')
  instance = new Online(new OfflineService())
}

export default instance
