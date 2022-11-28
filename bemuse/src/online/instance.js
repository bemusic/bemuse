/* eslint import/no-webpack-loader-syntax: off */
import config from 'val-loader?cacheable!./config'

import OfflineService from './OfflineService'
import Online from './index'
import OnlineService from './scoreboard-system/OnlineService'
import { isQueryFlagEnabled } from 'bemuse/flags'

export let instance = null

if (isQueryFlagEnabled('fake-scoreboard')) {
  instance = new Online(new OnlineService({ fake: true }))
} else if (isQueryFlagEnabled('offline')) {
  instance = new Online(new OfflineService())
} else if (config.SCOREBOARD_SERVER) {
  instance = new Online(new OnlineService({ server: config.SCOREBOARD_SERVER }))
} else {
  console.warn(
    'Warning: No server specified. Using a fake scoreboard that resets when you refresh the page.'
  )
  instance = new Online(new OnlineService({ fake: true }))
}

export default instance
