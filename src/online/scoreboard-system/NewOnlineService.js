import Auth0 from 'auth0-js'

import createScoreboardClient from './createScoreboardClient'

export class NewOnlineService {
  constructor ({
    server,
    storagePrefix = 'scoreboard.auth',
    authOptions
  }) {
    const auth = new Auth0.WebAuth({
      ...authOptions,
      redirectUri: window.location.href,
      responseType: 'token id_token'
    })
    this._scoreboardClient = createScoreboardClient({ server, auth })
    this._storagePrefix = storagePrefix
    this._updateUserFromStorage()
    this._renewPlayerToken()
  }

  _updateUserFromStorage () {
    const loadUser = (text) => {
      if (!text) return null
      try {
        return JSON.parse(text)
      } catch (e) {
        return null
      }
    }
    this._currentUser = loadUser(localStorage[`${this._storagePrefix}.id`])
  }

  _renewPlayerToken () {
    const playerToken = this._currentUser && this._currentUser.playerToken
    if (!playerToken) return
    const username = this._currentUser.username
    return this._scoreboardClient.renewPlayerToken({ playerToken })
      .then(newToken => {
        localStorage[`${this._storagePrefix}.id`] = JSON.stringify({
          username: username,
          playerToken: newToken
        })
      })
  }

  getCurrentUser () {
    if (this._currentUser && this._currentUser.playerToken) {
      return { username: this._currentUser.username }
    } else {
      return null
    }
  }

  isLoggedIn () {
    return !!this._currentUser
  }

  signUp ({ username, password, email }) {
    return this._scoreboardClient.signUp({ username, password, email })
      .then(signUpResult => {
        localStorage[`${this._storagePrefix}.id`] = JSON.stringify({
          username: username,
          playerToken: signUpResult.playerToken
        })
        this._updateUserFromStorage()
      })
  }

  logIn ({ username, password }) {
    return this._scoreboardClient.loginByUsernamePassword({ username, password })
      .then(loginResult => {
        localStorage[`${this._storagePrefix}.id`] = JSON.stringify({
          username: username,
          playerToken: loginResult.playerToken
        })
        this._updateUserFromStorage()
        return this.getCurrentUser()
      })
  }

  async logOut () {
    delete localStorage[`${this._storagePrefix}.id`]
    this._updateUserFromStorage()
  }

  async submitScore (info) {
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
        log: info.log
      }
    })
    const data = {
      md5: info.md5,
      playMode: info.playMode,
      ...toEntry(result.data.registerScore.resultingRow)
    }
    return data
  }

  // Retrieves a record.
  //
  // Returns a record object.
  async retrieveRecord (level, user) {
    const result = await this._scoreboardClient.retrieveRecord({
      playerToken: this._currentUser.playerToken,
      md5: level.md5,
      playMode: level.playMode,
    })
    const myRecord = result.data.chart.level.myRecord
    return myRecord && {
      md5: level.md5,
      playMode: level.playMode,
      ...toEntry(myRecord)
    }
  }

  // Retrieves the scoreboard
  async retrieveScoreboard ({ md5, playMode }) {
    const result = await this._scoreboardClient.retrieveScoreboard({ md5, playMode })
    return { data: result.data.chart.level.leaderboard.map(toEntry) }
  }

  // Retrieve multiple records!
  //
  // Items is an array of song items. They have a md5 property.
  async retrieveMultipleRecords (items) {
    const result = await this._scoreboardClient.retrieveRankingEntries({
      playerToken: this._currentUser.playerToken,
      md5s: items.map(item => item.md5)
    })
    const entries = result.data.me.records.map(item => ({
      ...toEntry(item),
      md5: item.md5,
      playMode: item.playMode
    }))
    return entries
  }
}

export default NewOnlineService

function toEntry (row) {
  return {
    rank: row.rank,
    score: row.entry.score,
    combo: row.entry.combo,
    count: row.entry.count,
    total: row.entry.total,
    playerName: row.entry.player.name,
    recordedAt: new Date(row.entry.recordedAt),
    playCount: row.entry.playCount,
    playNumber: row.entry.playNumber
  }
}
