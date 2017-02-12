import Auth0 from 'auth0-js'
import axios from 'axios'
import co from 'co'
import invariant from 'invariant'

import * as authenticationFlow from './authenticationFlow'

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
    throw new Error('meow')
    // return (
    //   wrapPromise(Parse.Cloud.run('submitScore', info))
    //   .then(({ data, meta: { rank } }) => {
    //     return Object.assign(toObject(data), { rank })
    //   })
    // )
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

function createScoreboardClient ({
  server,
  auth,
  log = (format, ...args) => console.log('[ScoreboardClient] ' + format, ...args)
}) {
  const client = axios.create({
    baseURL: server
  })

  function userSignUp (username, email, password, playerName) {
    return new Promise((resolve, reject) => {
      log('Signing up with Auth0')
      auth.signup({
        connection: 'Username-Password-Authentication',
        email: email,
        username: username,
        password: password,
        userMetadata: {
          playerName: playerName
        }
      }, function (err) {
        if (err) {
          log('Auth0 signup error', err)
          return reject(err)
        }
        log('Auth0 signup OK — now logging in')
        auth.client.login({
          realm: 'Username-Password-Authentication',
          username: username,
          password: password,
          scope: 'openid email profile'
        }, function (err, authResult) {
          if (err) {
            log('Auth0 login error', err)
            return reject(err)
          }
          log('Auth result', authResult)
          resolve({ idToken: authResult.idToken })
        })
      })
    })
  }

  function graphql ({ query, variables }) {
    return client
      .post('graphql', { query, variables })
  }

  function usernamePasswordLogin (playerId, password) {
    return new Promise((resolve, reject) => {
      log('Auth0 log in')
      auth.client.login({
        realm: 'Username-Password-Authentication',
        username: playerId,
        password: password,
        scope: 'openid email profile'
      }, function (err, authResult) {
        if (err) {
          log('Auth0 login error', err)
          return reject(err)
        }
        log('Auth result', authResult)
        resolve({ idToken: authResult.idToken })
      })
    })
  }

  function checkPlayerNameAvailability (playerName) {
    return Promise.resolve(
      graphql({
        query: `
          query checkPlayerNameAvailability ($name: String!) {
            player (name: $name) {
              id
            }
          }
        `,
        variables: {
          name: playerName
        }
      })
      .then(response => {
        log('checkPlayerNameAvailability response', response)
        if (response.data.data.player === null) {
          log('checkPlayerNameAvailability: Player name is available!')
          return true
        } else {
          log('checkPlayerNameAvailability: Player name already taken.')
          return false
        }
      })
    )
  }

  function resolvePlayerId (playerName) {
    return Promise.resolve(
      graphql({
        query: `
          query resolvePlayerId ($name: String!) {
            player (name: $name) {
              id
            }
          }
        `,
        variables: {
          name: playerName
        }
      })
      .then(response => {
        if (response.data.data.player === null) {
          return { error: 'Player not found...' }
        } else {
          return { playerId: response.data.data.player.id }
        }
      })
    )
  }

  function reservePlayerId (playerName) {
    return Promise.resolve(
      graphql({
        query: `
          mutation reservePlayerId ($name: String!) {
            registerPlayer(name: $name) {
              id
            }
          }
        `,
        variables: {
          name: playerName
        }
      })
      .then(response => {
        const playerId = response.data.data.registerPlayer.id
        log('reservePlayerId response', response, 'playerId', playerId)
        return playerId
      })
    )
  }

  function ensureLink (idToken) {
    return Promise.resolve(
      graphql({
        query: `
          mutation ensureLink ($jwt: String!) {
            linkPlayer(jwt: $jwt) {
              id,
              name
            }
          }
        `,
        variables: {
          jwt: idToken
        }
      })
      .then(response => {
        const playerId = response.data.data.linkPlayer.id
        const playerName = response.data.data.linkPlayer.name
        log('ensureLink response', response, 'playerId', playerId)
        return { playerId, playerName }
      })
    )
  }

  const scoreboardClient = {
    signUp ({ username, password, email }) {
      invariant(typeof username === 'string', 'username must be a string')
      invariant(typeof password === 'string', 'password must be a string')
      invariant(typeof email === 'string',    'email must be a string')
      return co(function * () {
        return yield * authenticationFlow.signUp(username, email, password, {
          log: (message) => log('[signUp]', message),
          userSignUp,
          checkPlayerNameAvailability,
          reservePlayerId,
          ensureLink
        })
      })
    },
    loginByUsernamePassword ({ username, password }) {
      invariant(typeof username === 'string', 'username must be a string')
      invariant(typeof password === 'string', 'password must be a string')
      return co(function * () {
        return yield * authenticationFlow.loginByUsernamePassword(username, password, {
          log: (message) => log('[loginByUsernamePassword]', message),
          usernamePasswordLogin,
          resolvePlayerId,
          ensureLink
        })
      })
    }
  }

  return scoreboardClient
}
