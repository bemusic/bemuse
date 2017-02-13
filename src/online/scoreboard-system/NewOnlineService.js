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

  getCurrentUser () {
    if (this._currentUser) {
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
          idToken: signUpResult.idToken
        })
        this._updateUserFromStorage()
      })
  }

  logIn ({ username, password }) {
    return this._scoreboardClient.loginByUsernamePassword({ username, password })
      .then(loginResult => {
        localStorage[`${this._storagePrefix}.id`] = JSON.stringify({
          username: username,
          idToken: loginResult.idToken
        })
        this._updateUserFromStorage()
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
      idToken: this._currentUser.idToken,
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
  }

  // Retrieves a record.
  //
  // Returns a record object.
  retrieveRecord (level, user) {
    throw new Error('meow')
    // return record object
  }

  // Retrieves the scoreboard
  retrieveScoreboard ({ md5, playMode }) {
    throw new Error('meow')
    // return { data: [ record ] }
  }

  // Retrieve multiple records!
  //
  // Items is an array of song items. They have a md5 property.
  retrieveMultipleRecords (items, user) {
    throw new Error('meow')
    // return [ records ]
  }
}

export default NewOnlineService
