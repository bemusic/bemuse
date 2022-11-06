import { isQueryFlagEnabled } from '../query-flags'
import withPersonalRecordLegacy from './withPersonalRecordLegacy'
import { withPersonalRecord as withPersonalRecordNext } from './withPersonalRecordNext'

export default isQueryFlagEnabled('scoreboard-next')
  ? withPersonalRecordNext
  : withPersonalRecordLegacy
