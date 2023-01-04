import OfflineService from './OfflineService'
import Online from './index'
import OnlineService from './scoreboard-system/OnlineService'
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import config from 'val-loader?cacheable!./config'
import { createContext } from 'react'
import { isQueryFlagEnabled } from 'bemuse/flags'

let instance: Online

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

export const OnlineContext = createContext(instance)
