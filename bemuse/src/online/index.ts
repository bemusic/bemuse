import {
  Action,
  DataStore,
  initialState,
  put,
  putMultiple,
  store川,
} from './data-store'
import {
  INITIAL_OPERATION_STATE,
  Operation,
  completed,
  operation川FromPromise,
} from './operations'
import {
  Observable,
  ObservableInput,
  Subject,
  asapScheduler,
  bufferTime,
  combineLatest,
  concatMap,
  distinctUntilChanged,
  from,
  map,
  merge,
  of,
  scan,
  scheduled,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs'
import { RecordLevel, fromObject } from './level'

import Immutable from 'immutable'
import { ScoreCount } from 'bemuse/rules/accuracy'
import _ from 'lodash'
import id from './id'

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

export type RankingInfo = Partial<ScoreBase> & RecordLevel

const scoreInfoGuard = (data: ScoreInfo | RankingInfo): data is ScoreInfo =>
  !!data.score

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

export interface AccountService {
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
    levels: readonly RecordLevel[]
  ): Promise<ScoreboardDataRecord[]>
}

export interface RankingStream {
  state川: Observable<RankingState>
  resubmit: () => void
  reloadScoreboard: () => void
}

export class Online {
  constructor(private readonly service: AccountService) {}

  private user口 = new Subject<UserInfo | null>()
  private seen口 = new Subject<RecordLevel>()
  private submitted口 = new Subject<ScoreboardDataRecord>()

  user川 = this.user口
    .pipe(startWith(null))
    .pipe(shareReplay(1))
    .pipe(map((user) => user || this.service.getCurrentUser()))

  async signUp(options: SignUpInfo) {
    const user = await this.service.signUp(options)
    this.user口.next(user)
    return user
  }

  async logIn(options: LogInInfo) {
    const user = await this.service.logIn(options)
    this.user口.next(user)
    return user
  }

  changePassword(options: ChangePasswordInfo) {
    return Promise.resolve(this.service.changePassword(options))
  }

  async logOut(): Promise<void> {
    await this.service.logOut()
    this.user口.next(null)
  }

  async submitScore(info: ScoreInfo) {
    const record = await this.service.submitScore(info)
    this.submitted口.next(record)
    return record
  }

  scoreboard(level: RecordLevel) {
    return this.service.retrieveScoreboard(level)
  }

  private allSeen川 = this.allSeen川ForJustSeen川(this.seen口)

  private allSeen川ForJustSeen川(
    justSeen川: Observable<RecordLevel>
  ): Observable<RecordLevel[]> {
    return justSeen川
      .pipe(bufferTime(138))
      .pipe(
        scan(
          (map, seen) =>
            map.merge(Immutable.Map(_.zipObject(seen.map(id), seen))),
          Immutable.Map<string, RecordLevel>()
        )
      )
      .pipe(map((map) => map.valueSeq()))
      .pipe(distinctUntilChanged(Immutable.is))
      .pipe(map((seq) => seq.toArray()))
  }

  private fetchRecords = async (
    levels: readonly RecordLevel[],
    user: UserInfo | null,
    seen: Set<string>
  ): Promise<Action<ScoreboardDataRecord | null>> => {
    const levelsToFetch = levels.filter((level) => !seen.has(id(level)))
    for (const level of levelsToFetch) {
      seen.add(id(level))
    }
    const results =
      user && levelsToFetch.length > 0
        ? await this.service.retrieveMultipleRecords(levelsToFetch)
        : []
    try {
      const loadedRecords = _.zipObject(results.map(id), results.map(completed))
      const nullResults = _.zipObject(
        levelsToFetch.map(id),
        levelsToFetch.map(() => completed(null))
      )
      const transitions = _.defaults(loadedRecords, nullResults)
      return putMultiple<ScoreboardDataRecord | null>(transitions)
    } catch (e: unknown) {
      console.error('Cannot fetch levels:', e)
      return putMultiple({})
    }
  }

  private records川ForUser = (
    user: UserInfo | null
  ): Observable<DataStore<ScoreboardDataRecord | null>> => {
    const seen = new Set<string>()

    const action川 = merge(
      this.allSeen川.pipe(
        concatMap((x) => from(this.fetchRecords(x, user, seen)))
      ),
      this.submitted口.pipe(map((record) => put(id(record), completed(record))))
    )
    return store川(action川)
  }

  records川 = this.user川
    .pipe(switchMap(this.records川ForUser))
    .pipe(startWith(initialState<ScoreboardDataRecord | null>()))
    .pipe(shareReplay(1))

  dispose() {}

  Ranking(data: RankingInfo): RankingStream {
    const level: RecordLevel = fromObject(data)
    const retrySelf口 = new Subject<void>()
    const retryScoreboard口 = new Subject<void>()

    const self川 = this.self川ForUser(retrySelf口, data)
    const scoreboard川 = self川
      .pipe(
        switchMap(() => this.getScoreboardState川(retryScoreboard口, level))
      )
      .pipe(shareReplay(1))
    const state川 = combineLatest({
      self: self川,
      scoreboard: scoreboard川,
    }).pipe(map(this.conformState))
    return {
      state川,
      resubmit: () => retrySelf口.next(),
      reloadScoreboard: () => retryScoreboard口.next(),
    }
  }

  // Make the state conform the old API. We should remove this in the future.
  private conformState = ({
    self,
    scoreboard,
  }: {
    self: SubmissionOperation
    scoreboard: Operation<{ data: ScoreboardDataEntry[] }>
  }): RankingState => ({
    data:
      scoreboard.status === 'completed' ? scoreboard.value?.data ?? null : null,
    meta: {
      scoreboard: _.omit(scoreboard, 'value') as Operation<ScoreboardDataEntry>,
      submission: { ...self } as Operation<ScoreboardDataEntry>,
    },
  })

  private self川ForUser = (
    retrySelfBus: Observable<void>,
    data: ScoreInfo | RankingInfo
  ): Observable<SubmissionOperation> =>
    this.user川
      .pipe(
        switchMap((user) => {
          if (!user) {
            return this.unauthenticatedRankingModel()
          }
          if (scoreInfoGuard(data)) {
            return this.submissionModel(retrySelfBus, data)
          }
          return this.viewRecordModel(retrySelfBus, data)
        })
      )
      .pipe(startWith(INITIAL_OPERATION_STATE))
      .pipe(shareReplay(1))

  private unauthenticatedRankingModel = (): Observable<SubmissionOperation> =>
    of({
      status: 'unauthenticated',
      error: null,
      record: null,
    })

  private submissionModel = (
    retrySelfBus: Observable<void>,
    data: ScoreInfo
  ): Observable<SubmissionOperation> =>
    merge(this.asap川([[]]), retrySelfBus).pipe(
      switchMap(() => operation川FromPromise(this.submitScore(data)))
    )

  private viewRecordModel = (
    retrySelfBus: Observable<void>,
    data: RankingInfo
  ): Observable<SubmissionOperation> =>
    merge(this.asap川([[]]), retrySelfBus).pipe(
      switchMap(() => operation川FromPromise(this.service.retrieveRecord(data)))
    )

  private getScoreboardState川 = (
    retryScoreboardBus: Observable<void>,
    level: RecordLevel
  ): Observable<Operation<{ data: ScoreboardDataEntry[] }>> =>
    merge(this.asap川([[]]), retryScoreboardBus).pipe(
      switchMap(() => operation川FromPromise(this.scoreboard(level)))
    )

  private asap川 = <T>(input: ObservableInput<T>) =>
    scheduled(input, asapScheduler)

  seen(level: RecordLevel) {
    return this.seen口.next(level)
  }
}

export default Online
