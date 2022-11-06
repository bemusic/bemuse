import React from 'react'
import { Chart } from 'bemuse-types'
import { useQuery } from '@tanstack/react-query'

export interface PersonalRecordQueryProps {
  chart: Chart
}

export interface PersonalRecord {
  /** The total score. */
  score: number
  /** The maximum combo. */
  combo: number
  /** The number of notes hit in each judgment category. */
  count: [
    meticulous: number,
    precise: number,
    good: number,
    offbeat: number,
    missed: number
  ]
  /** The maximum number of attainable combo. */
  total: number
  /** The player name. */
  playerName: string
  /** The time when the record was recorded. */
  recordedAt: string
  /** The number of times the song was played. */
  playCount: number
  /** The play number corresponding to this record. */
  playNumber: number
  /** The MD5 hash of the note chart. */
  md5: string
  /** The play mode. */
  playMode: string
}

export function withPersonalRecord<T>(Component: any): any {
  return function ComponentWithPersonalRecord(props: any) {
    const md5 = props.chart.md5
    const playMode = 'KB' // TODO: get play mode from redux
    const personalRecord = usePersonalRecord(md5, playMode)
    const addedProps: WithPersonalRecordAddedProps = {
      loading: personalRecord.isLoading,
      record: personalRecord.data,
    }
    return <Component {...props} {...addedProps} />
  }
}

export function usePersonalRecord(md5: string, playMode: string) {
  return useQuery({
    queryKey: ['personal-record', md5, playMode],
    queryFn: () => null,
  })
}

export interface WithPersonalRecordAddedProps {
  record?: PersonalRecord | null
  loading: boolean
}
