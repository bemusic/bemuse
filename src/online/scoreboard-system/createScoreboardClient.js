import axios from 'axios'
import co from 'co'
import invariant from 'invariant'

import * as authenticationFlow from './authenticationFlow'

export default function createScoreboardClient ({
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
          return reject(coerceAuth0ErrorToErrorObject(err))
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
            return reject(coerceAuth0ErrorToErrorObject(err))
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
      .then(response => response.data)
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
          return reject(coerceAuth0ErrorToErrorObject(err))
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
              linked
            }
          }
        `,
        variables: {
          name: playerName
        }
      })
      .then(result => {
        log('checkPlayerNameAvailability response', result)
        if (result.data.player && result.data.player.linked) {
          log('checkPlayerNameAvailability: Player name already taken.')
          return false
        } else {
          log('checkPlayerNameAvailability: Player name is available!')
          return true
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
      .then(result => {
        if (result.data.player === null) {
          return { error: 'Player not found...' }
        } else {
          return { playerId: result.data.player.id }
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
      .then(result => {
        const playerId = result.data.registerPlayer.id
        log('reservePlayerId response', result, 'playerId', playerId)
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
      .then(result => {
        const playerId = result.data.linkPlayer.id
        const playerName = result.data.linkPlayer.name
        log('ensureLink response', result, 'playerId', playerId)
        return { playerId, playerName }
      })
    )
  }

  function resolvePlayerTokenFromIdToken (idToken) {
    return Promise.resolve(
      graphql({
        query: `
          mutation resolvePlayerTokenFromIdToken ($jwt: String!) {
            authenticatePlayer(jwt: $jwt) { playerToken }
          }
        `,
        variables: {
          jwt: idToken
        }
      })
      .then(result => {
        return result.data.authenticatePlayer.playerToken
      })
    )
  }

  const ENTRY = `{
    id
    score
    total
    combo
    count
    playNumber
    playCount
    recordedAt
    player { name }
  }`

  const ROW = `{
    rank
    entry ${ENTRY}
  }`

  const scoreboardClient = {
    signUp ({ username, password, email }) {
      invariant(typeof username === 'string', 'username must be a string')
      invariant(typeof password === 'string', 'password must be a string')
      invariant(typeof email === 'string',    'email must be a string')
      return co(function * () {
        const { idToken } = yield * authenticationFlow.signUp(username, email, password, {
          log: (message) => log('[signUp]', message),
          userSignUp,
          checkPlayerNameAvailability,
          reservePlayerId,
          ensureLink
        })
        return { playerToken: yield resolvePlayerTokenFromIdToken(idToken) }
      })
    },
    loginByUsernamePassword ({ username, password }) {
      invariant(typeof username === 'string', 'username must be a string')
      invariant(typeof password === 'string', 'password must be a string')
      return co(function * () {
        const { idToken } = yield * authenticationFlow.loginByUsernamePassword(username, password, {
          log: (message) => log('[loginByUsernamePassword]', message),
          usernamePasswordLogin,
          resolvePlayerId,
          ensureLink
        })
        return { playerToken: yield resolvePlayerTokenFromIdToken(idToken) }
      })
    },
    submitScore ({ playerToken, md5, playMode, input }) {
      return graphql({
        query: `
          mutation submitScore ($playerToken: String!, $md5: String!, $playMode: String!, $input: RegisterScoreInput!) {
            registerScore (playerToken: $playerToken, md5: $md5, playMode: $playMode, input: $input) {
              resultingRow ${ROW}
            }
          }
        `,
        variables: {
          playerToken,
          md5,
          playMode,
          input
        }
      })
    },
    retrieveScoreboard ({ md5, playMode }) {
      return graphql({
        query: `
          query retrieveScoreboard ($md5: String!, $playMode: String!) {
            chart (md5: $md5) {
              level (playMode: $playMode) {
                leaderboard (max: 50) ${ROW}
              }
            }
          }
        `,
        variables: {
          md5,
          playMode
        }
      })
    },
    retrieveRecord ({ playerToken, md5, playMode }) {
      return graphql({
        query: `
          query retrieveRecord ($md5: String!, $playMode: String!, $playerToken: String!) {
            chart (md5: $md5) {
              level (playMode: $playMode) {
                myRecord (playerToken: $playerToken) ${ROW}
              }
            }
          }
        `,
        variables: {
          md5,
          playMode,
          playerToken
        }
      })
    },
    retrieveRankingEntries ({ playerToken, md5s }) {
      return graphql({
        query: `
          query retrieveRecord ($md5s: [String], $playerToken: String!) {
            me (playerToken: $playerToken) {
              records (md5s: $md5s) {
                md5
                playMode
                entry ${ENTRY}
              }
            }
          }
        `,
        variables: {
          md5s,
          playerToken
        }
      })
    },
    renewPlayerToken ({ playerToken }) {
      return graphql({
        query: `
          mutation renewPlayerToken ($playerToken: String!) {
            renewPlayerToken (playerToken: $playerToken) {
              playerToken
            }
          }
        `,
        variables: { playerToken }
      })
      .then(result => result.data.renewPlayerToken.playerToken)
    }
  }

  return scoreboardClient
}

function coerceAuth0ErrorToErrorObject (err) {
  return new Error(`Auth0 Error: ${err.statusCode} ${err.description} [${err.code}]`)
}
