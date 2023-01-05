import type {
  InternetRankingService,
  ChangePasswordInfo,
  LogInInfo,
  ScoreInfo,
  ScoreboardDataEntry,
  SignUpInfo,
} from '..'
import { ScoreboardClient, ScoreboardRow } from './ScoreboardClient'

import { RecordLevel } from '../level'
import { createFakeScoreboardClient } from './createFakeScoreboardClient'
import { createNextScoreboardClient } from './createNextScoreboardClient'
import { isTestModeEnabled } from 'bemuse/devtools/BemuseTestMode'

export interface OnlineServiceOptions {
  fake?: boolean
  server?: string
  storagePrefix?: string
  storage?: Storage
}

interface User {
  username: string
  playerToken: string
}

export class OnlineService implements InternetRankingService {
  private _isFake: boolean
  private _scoreboardClient: ScoreboardClient
  private _storage: Storage
  private _storagePrefix: string
  private _currentUser: User | undefined

  constructor({
    fake = false,
    server,
    storagePrefix = fake ? 'fake-scoreboard.auth' : 'scoreboard.auth',
    storage = localStorage,
  }: OnlineServiceOptions) {
    this._isFake = fake
    this._scoreboardClient =
      fake || !server
        ? createFakeScoreboardClient()
        : createNextScoreboardClient({ server, log: () => {} })
    this._storage = storage
    this._storagePrefix = storagePrefix
    this._updateUserFromStorage()
    this._renewPlayerToken()
  }

  _updateUserFromStorage() {
    const loadUser = (text: string | null) => {
      if (!text) return null
      try {
        const data = JSON.parse(text)
        const playerToken = data.playerToken
        const playerTokenExpires = playerToken.startsWith('FAKE!')
          ? Date.now() + 86400e3 * 7
          : JSON.parse(atob(playerToken.split('.')[1])).exp * 1000
        if (Date.now() > playerTokenExpires - 86400e3) {
          console.warn('Authentication token is about to expire, skipping!')
          return null
        }
        return data
      } catch (e) {
        return null
      }
    }
    this._currentUser = loadUser(
      this._storage.getItem(`${this._storagePrefix}.id`)
    )
  }

  _renewPlayerToken() {
    if (!this._currentUser) {
      return
    }
    const { playerToken, username } = this._currentUser
    return this._scoreboardClient
      .renewPlayerToken({ playerToken })
      .then((newToken) => {
        if (this._storage.getItem(`${this._storagePrefix}.id`)) {
          this._storage.setItem(
            `${this._storagePrefix}.id`,
            JSON.stringify({
              username: username,
              playerToken: newToken,
            })
          )
        }
      })
  }

  getCurrentUser() {
    if (this._currentUser && this._currentUser.playerToken) {
      return { username: this._currentUser.username }
    } else {
      return null
    }
  }

  isLoggedIn() {
    return !!this._currentUser
  }

  signUp({ username, password, email }: SignUpInfo) {
    return this._scoreboardClient
      .signUp({ username, password, email })
      .then((signUpResult) => {
        this._storage.setItem(
          `${this._storagePrefix}.id`,
          JSON.stringify({
            username: username,
            playerToken: signUpResult.playerToken,
          })
        )
        this._updateUserFromStorage()
        return this.getCurrentUser()
      })
  }

  logIn({ username, password }: LogInInfo) {
    return this._scoreboardClient
      .loginByUsernamePassword({ username, password })
      .then((loginResult) => {
        this._storage.setItem(
          `${this._storagePrefix}.id`,
          JSON.stringify({
            username: username,
            playerToken: loginResult.playerToken,
          })
        )
        this._updateUserFromStorage()
        return this.getCurrentUser()
      })
  }

  changePassword({ email }: ChangePasswordInfo) {
    return this._scoreboardClient.changePassword({ email })
  }

  async logOut() {
    this._storage.removeItem(`${this._storagePrefix}.id`)
    this._updateUserFromStorage()
  }

  async submitScore(info: ScoreInfo) {
    if (isTestModeEnabled() && !this._isFake) {
      throw new Error('Cannot submit score in test mode')
    }
    if (!this._currentUser) {
      throw new Error('Not logged in')
    }
    const result = await this._scoreboardClient.submitScore({
      playerToken: this._currentUser.playerToken,
      md5: info.md5,
      playMode: info.playMode,
      input: {
        score: info.score,
        combo: info.combo,
        count: info.count,
        total: info.total,
        log: info.log,
      },
    })
    const data = {
      md5: info.md5,
      playMode: info.playMode,
      ...toEntry(result.data.registerScore.resultingRow),
    }
    return data
  }

  // Retrieves a record.
  //
  // Returns a record object.
  async retrieveRecord(level: RecordLevel) {
    if (!this._currentUser) {
      throw new Error('Not logged in')
    }
    const result = await this._scoreboardClient.retrieveRecord({
      playerToken: this._currentUser.playerToken,
      md5: level.md5,
      playMode: level.playMode,
    })
    const myRecord = result.data.chart.level.myRecord
    return (
      myRecord && {
        md5: level.md5,
        playMode: level.playMode,
        ...toEntry(myRecord),
      }
    )
  }

  // Retrieves the scoreboard
  async retrieveScoreboard({ md5, playMode }: RecordLevel) {
    const result = await this._scoreboardClient.retrieveScoreboard({
      md5,
      playMode,
    })
    return { data: result.data.chart.level.leaderboard.map(toEntry) }
  }

  // Retrieve multiple records!
  //
  // Items is an array of song items. They have a md5 property.
  async retrieveMultipleRecords(items: readonly RecordLevel[]) {
    if (!this._currentUser) {
      throw new Error('Not logged in')
    }
    const result = await this._scoreboardClient.retrieveRankingEntries({
      playerToken: this._currentUser.playerToken,
      md5s: items.map((item) => item.md5),
    })
    const entries = result.data.me.records.map((item) => ({
      ...toEntry(item),
      md5: item.md5,
      playMode: item.playMode,
    }))
    return entries
  }
}

export default OnlineService

function toEntry(row: ScoreboardRow): ScoreboardDataEntry {
  return {
    rank: row.rank,
    score: row.entry.score,
    combo: row.entry.combo,
    count: row.entry.count,
    total: row.entry.total,
    playerName: row.entry.player.name,
    recordedAt: new Date(row.entry.recordedAt),
    playCount: row.entry.playCount,
    playNumber: row.entry.playNumber,
  }
}
