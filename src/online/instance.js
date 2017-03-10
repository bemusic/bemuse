import config           from 'val?cacheable!./config'
import { Parse }        from 'parse'

import NewOnlineService from './scoreboard-system/NewOnlineService'
import OfflineService   from './offline-service'
import Online           from './index'
import OnlineService    from './online-service'

export let instance = null

if (config.AUTH0_CLIENT_ID && config.AUTH0_DOMAIN && config.SCOREBOARD_SERVER) {
  instance = new Online(new NewOnlineService({
    server: config.SCOREBOARD_SERVER,
    authOptions: {
      domain: config.AUTH0_DOMAIN,
      clientID: config.AUTH0_CLIENT_ID
    }
  }))
} else if (config.PARSE_APP_ID && config.PARSE_API_KEY) {
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
