import config           from 'val-loader?cacheable!./config'

import OfflineService   from './OfflineService'
import Online           from './index'
import OnlineService    from './scoreboard-system/OnlineService'

export let instance = null

if (config.AUTH0_CLIENT_ID && config.AUTH0_DOMAIN && config.SCOREBOARD_SERVER) {
  instance = new Online(new OnlineService({
    server: config.SCOREBOARD_SERVER,
    authOptions: {
      domain: config.AUTH0_DOMAIN,
      clientID: config.AUTH0_CLIENT_ID
    }
  }))
} else {
  console.warn('Warning: No Parse API keys specified. Online functionalities wilt not work.')
  instance = new Online(new OfflineService())
}

export default instance
