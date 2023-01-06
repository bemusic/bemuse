import { RecordLevel } from './level'
import { Operation } from './operations'

import { queryClient } from 'bemuse/react-query'
import { ScoreCount } from 'bemuse/rules/accuracy'
import { BatchedFetcher } from './BatchedFetcher'
import { rootQueryKey } from './queryKeys'

export interface SignUpInfo {
  username: string
  password: string
  email: string
}

export interface LogInInfo {
  username: string
  password: string
}

export interface UserInfo {
  username: string
}

export interface ChangePasswordInfo {
  email: string
}

export interface ScoreBase {
  score: number
  combo: number
  count: ScoreCount
  total: number
  log: string
}

export type ScoreInfo = ScoreBase & RecordLevel

export interface ScoreboardDataEntry {
  rank?: number
  score: number
  combo?: number
  count: ScoreCount
  total: number
  playerName: string
  recordedAt?: Date
  playCount?: number
  playNumber?: number
}

export type ScoreboardDataRecord = ScoreboardDataEntry & RecordLevel

export type SubmissionOperation =
  | Operation<ScoreboardDataEntry | null>
  | Readonly<{
      status: 'unauthenticated'
    }>

export interface RankingState {
  data: ScoreboardDataEntry[] | null
  meta: {
    submission: SubmissionOperation
    scoreboard: Operation<ScoreboardDataEntry | null>
  }
}

export interface InternetRankingService {
  getCurrentUser(): UserInfo | null
  signUp(signUpInfo: SignUpInfo): Promise<UserInfo | null>
  logIn(logInInfo: LogInInfo): Promise<UserInfo | null>
  changePassword(changePasswordInfo: ChangePasswordInfo): Promise<object>
  logOut(): Promise<void>
  submitScore(scoreInfo: ScoreInfo): Promise<ScoreboardDataRecord>
  retrieveRecord(level: RecordLevel): Promise<ScoreboardDataRecord | null>
  retrieveScoreboard(
    level: RecordLevel
  ): Promise<{ data: ScoreboardDataEntry[] }>
  retrieveMultipleRecords(
    levels: readonly { md5: string }[]
  ): Promise<ScoreboardDataRecord[]>
}

export class Online {
  constructor(private readonly service: InternetRankingService) {}

  getCurrentUser() {
    return this.service.getCurrentUser()
  }

  async signUp(options: SignUpInfo) {
    const user = await this.service.signUp(options)
    queryClient.invalidateQueries({ queryKey: rootQueryKey })
    return user
  }

  async logIn(options: LogInInfo) {
    const user = await this.service.logIn(options)
    queryClient.invalidateQueries({ queryKey: rootQueryKey })
    return user
  }

  batchedRecordFetcher = new BatchedFetcher<ScoreboardDataRecord>(
    (md5s) =>
      this.service.retrieveMultipleRecords(md5s.map((md5) => ({ md5 }))),
    (record) => record.md5
  )

  getPersonalRecordsByMd5(md5: string) {
    if (!this.service.getCurrentUser()) return []
    return this.batchedRecordFetcher.load(md5)
  }

  changePassword(options: ChangePasswordInfo) {
    return Promise.resolve(this.service.changePassword(options))
  }

  async logOut(): Promise<void> {
    await this.service.logOut()
    queryClient.invalidateQueries({ queryKey: rootQueryKey })
  }

  async submitScore(info: ScoreInfo) {
    if (!this.service.getCurrentUser()) {
      throw new Error('Unauthenticated.')
    }
    const record = await this.service.submitScore(info)
    return record
  }

  scoreboard(level: RecordLevel) {
    return this.service.retrieveScoreboard(level)
  }

  retrievePersonalRankingEntry(level: RecordLevel) {
    if (!this.service.getCurrentUser()) return null
    return this.service.retrieveRecord(level)
  }
}

export default Online
