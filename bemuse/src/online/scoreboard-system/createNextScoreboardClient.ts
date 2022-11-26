import axios from 'axios'
import invariant from 'invariant'
import { ScoreboardClient, ScoreboardRow } from './ScoreboardClient'

export interface CreateScoreboardClientOptions {
  /**
   * The URL of the scoreboard server.
   */
  server: string
}

export function createNextScoreboardClient({
  server,
}: CreateScoreboardClientOptions): ScoreboardClient {
  const client = axios.create({
    baseURL: server,
  })

  async function getMyRecord(
    playerToken: string,
    md5: string,
    playMode: string
  ) {
    const response = await client
      .get(`/api/scoreboard/${md5}/${playMode}/mine`, {
        headers: { Authorization: `Bearer ${playerToken}` },
      })
      .catch(handleAxiosError('Unable to retrieve personal records'))
    return response.data.data as ScoreboardRow
  }

  const scoreboardClient: ScoreboardClient = {
    async signUp({ username, password, email }) {
      invariant(typeof username === 'string', 'username must be a string')
      invariant(typeof password === 'string', 'password must be a string')
      invariant(typeof email === 'string', 'email must be a string')
      const response = await client
        .post('/api/auth/signup', {
          username,
          password,
          email,
        })
        .catch(handleAxiosError('Unable to sign up'))
      return { playerToken: response.data.playerToken }
    },
    async loginByUsernamePassword({ username, password }) {
      invariant(typeof username === 'string', 'username must be a string')
      invariant(typeof password === 'string', 'password must be a string')
      const response = await client
        .post('/api/auth/login', {
          username,
          password,
        })
        .catch(handleAxiosError('Unable to log in'))
      return { playerToken: response.data.playerToken }
    },
    async changePassword({ email }) {
      throw new Error('Not implemented')
    },
    async submitScore({ playerToken, md5, playMode, input }) {
      await client
        .post(
          `/api/scoreboard/${md5}/${playMode}/submit`,
          { scoreData: input },
          { headers: { Authorization: `Bearer ${playerToken}` } }
        )
        .catch(handleAxiosError('Unable to submit score'))
      return {
        data: {
          registerScore: {
            resultingRow: await getMyRecord(playerToken, md5, playMode),
          },
        },
      }
    },
    async retrieveScoreboard({ md5, playMode }) {
      const response = await client
        .get(`/api/scoreboard/${md5}/${playMode}/leaderboard`)
        .catch(handleAxiosError('Unable to retrieve leaderboard'))
      return {
        data: {
          chart: {
            level: {
              leaderboard: response.data.data,
            },
          },
        },
      }
    },
    async retrieveRecord({ playerToken, md5, playMode }) {
      return {
        data: {
          chart: {
            level: {
              myRecord: await getMyRecord(playerToken, md5, playMode),
            },
          },
        },
      }
    },
    async retrieveRankingEntries({ playerToken, md5s }) {
      const response = await client
        .post(
          `/api/scoreboard/records`,
          { md5s },
          { headers: { Authorization: `Bearer ${playerToken}` } }
        )
        .catch(handleAxiosError('Unable to retrieve ranking entries'))
      return {
        data: {
          me: {
            records: response.data.data,
          },
        },
      }
    },
    async renewPlayerToken({ playerToken }) {
      throw new Error('Not implemented')
    },
  }

  return scoreboardClient
}
function handleAxiosError(prefix: string) {
  return (error: any): never => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data
      const message = data?.message
      const suffix = message ? `: ${message}` : ''
      if (data) {
        throw new Error(`${prefix}: ${error}${suffix}`)
      }
    }
    throw error
  }
}
