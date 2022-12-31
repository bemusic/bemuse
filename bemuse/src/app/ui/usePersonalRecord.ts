import './MusicInfoTabStats.scss'

import * as DataStore from 'bemuse/online/data-store'
import * as ReduxState from '../redux/ReduxState'

import { useContext, useEffect, useState } from 'react'

import { MappingMode } from '../entities/Options'
import { OnlineContext } from 'bemuse/online/instance'
import { Operation } from 'bemuse/online/operations'
import { RecordLevel } from 'bemuse/online/level'
import type { ScoreboardDataRecord } from 'bemuse/online'
import _ from 'lodash'
import id from 'bemuse/online/id'
import { useSelector } from 'react-redux'

export interface PartialChart {
  md5: string
}

const getLevel = ({
  chart,
  playMode,
}: {
  chart: PartialChart
  playMode: MappingMode
}) => ({ md5: chart.md5, playMode })

const getRecordState = (
  onlineRecords: DataStore.DataStore<ScoreboardDataRecord | null>,
  level: RecordLevel
): Operation<ScoreboardDataRecord | null> =>
  DataStore.get(onlineRecords, id(level))

export const usePersonalRecord = (
  chart: PartialChart
): [isLoading: boolean, record: ScoreboardDataRecord | null] => {
  const online = useContext(OnlineContext)
  const playMode = useSelector(ReduxState.selectPlayMode)
  const [recordState, setRecordState] =
    useState<Operation<ScoreboardDataRecord | null> | null>(null)

  useEffect(() => {
    online.seen(getLevel({ chart, playMode }))
    const subscription = online.records川.subscribe((records) => {
      setRecordState(getRecordState(records, getLevel({ chart, playMode })))
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return [
    recordState?.status === 'loading',
    recordState
      ? recordState.status === 'completed'
        ? recordState.value
        : null
      : null,
  ]
}
