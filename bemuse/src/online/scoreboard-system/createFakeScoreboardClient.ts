import ObjectID from 'bson-objectid'
import {
  ScoreboardClient,
  ScoreboardEntry,
  ScoreboardRow,
} from './ScoreboardClient'
import delay from 'delay'

interface Submission {
  md5: string
  playMode: string
  entry: ScoreboardEntry
}

export function createFakeScoreboardClient(): ScoreboardClient {
  let submissions: Submission[] = []
  const signedUpUsernames = new Set<string>()

  const client: ScoreboardClient = {
    signUp: async (options) => {
      await delay(100)
      if (signedUpUsernames.has(options.username)) {
        throw new Error('Username already taken')
      }
      signedUpUsernames.add(options.username)
      return { playerToken: 'FAKE!' + options.username }
    },
    loginByUsernamePassword: async (options) => {
      await delay(100)
      return { playerToken: 'FAKE!' + options.username }
    },
    changePassword: async (options) => {
      return {}
    },
    renewPlayerToken: async (options) => {
      return options.playerToken
    },
    submitScore: async (options) => {
      await delay(100)
      const { username } = decodeFakePlayerToken(options.playerToken)
      const matching = (s: Submission): boolean =>
        s.md5 === options.md5 &&
        s.playMode === options.playMode &&
        s.entry.player.name === username
      const existingSubmission = submissions.find(matching)
      const newScoreboardEntry = updateScoreboardEntry(
        existingSubmission?.entry,
        options.input,
        { name: username }
      )
      submissions = submissions.filter((s) => !matching(s))
      submissions.push({
        md5: options.md5,
        playMode: options.playMode,
        entry: newScoreboardEntry,
      })
      return {
        data: {
          registerScore: {
            resultingRow: getRow(options.md5, options.playMode, username)!,
          },
        },
      }
    },
    retrieveRankingEntries: async (options) => {
      await delay(100)
      const { username } = decodeFakePlayerToken(options.playerToken)
      const set = new Set<string>(options.md5s)
      return {
        data: {
          me: {
            records: submissions.filter(
              (s) => set.has(s.md5) && s.entry.player.name === username
            ),
          },
        },
      }
    },
    retrieveRecord: async (options) => {
      await delay(100)
      const { username } = decodeFakePlayerToken(options.playerToken)
      return {
        data: {
          chart: {
            level: {
              myRecord: getRow(options.md5, options.playMode, username),
            },
          },
        },
      }
    },
    retrieveScoreboard: async (options) => {
      await delay(100)
      return {
        data: {
          chart: {
            level: {
              leaderboard: getChartSubmissions(
                options.md5,
                options.playMode
              ).map((s, i) => ({ rank: i + 1, entry: s.entry })),
            },
          },
        },
      }
    },
  }

  function getRow(
    md5: string,
    playMode: string,
    username: string
  ): ScoreboardRow | null {
    const chartSubmissions = getChartSubmissions(md5, playMode)
    const mySubmission = chartSubmissions.find(
      (s) => s.entry.player.name === username
    )
    if (!mySubmission) {
      return null
    }
    const myRank =
      chartSubmissions.filter((s) => s.entry.score > mySubmission.entry.score)
        .length + 1
    return {
      rank: myRank,
      entry: mySubmission.entry,
    }
  }

  function getChartSubmissions(md5: string, playMode: string) {
    return submissions
      .filter((s) => s.md5 === md5 && s.playMode === playMode)
      .sort((a, b) => b.entry.score - a.entry.score)
  }

  return client
}

function decodeFakePlayerToken(token: string) {
  if (!token.startsWith('FAKE!')) {
    throw new Error('Invalid player token: ' + token)
  }
  return { username: token.replace(/^FAKE!/, '') }
}

export interface ScoreData {
  score: number
  combo: number
  count: [number, number, number, number, number]
  total: number
  log: string
}

export function updateScoreboardEntry(
  original: ScoreboardEntry | null | undefined,
  data: ScoreData,
  player: { name: string }
): ScoreboardEntry {
  const nextPlayCount = (original?.playCount || 0) + 1
  const score = +data.score
  if (!original || score > original.score) {
    return Object.assign({}, original || {}, {
      id: original?.id || ObjectID.generate(),
      score: score,
      playCount: nextPlayCount,
      playNumber: nextPlayCount,
      combo: +data.combo || 0,
      count: [
        +data.count[0] || 0,
        +data.count[1] || 0,
        +data.count[2] || 0,
        +data.count[3] || 0,
        +data.count[4] || 0,
      ] as [number, number, number, number, number],
      total: +data.total || 0,
      recordedAt: new Date().toJSON(),
      player: player,
    })
  } else {
    return Object.assign({}, original, {
      playCount: nextPlayCount,
    })
  }
}
