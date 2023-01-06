import {
  ScoreboardClient,
  ScoreboardEntry,
  ScoreboardRow,
} from './ScoreboardClient'

import { MappingMode } from 'bemuse/rules/mapping-mode'
import ObjectID from 'bson-objectid'
import type { ScoreCount } from 'bemuse/rules/accuracy'
import delay from 'delay'

interface Submission {
  md5: string
  playMode: MappingMode
  entry: ScoreboardEntry
}

export function createFakeScoreboardClient(): ScoreboardClient {
  let submissions: Submission[] = [
    {
      md5: '12345670123456789abcdef89abemuse',
      playMode: 'TS',
      entry: {
        id: 'preexisting1',
        score: 111111,
        total: 1,
        combo: 1,
        count: [0, 0, 0, 1, 0],
        playNumber: 1,
        playCount: 1,
        recordedAt: '2022-12-31T23:59:59.999Z',
        player: {
          name: 'tester',
        },
      },
    },
    {
      md5: '12345670123456789abcdef89abemuse',
      playMode: 'TS',
      entry: {
        id: 'preexisting2',
        score: 222222,
        total: 1,
        combo: 1,
        count: [0, 0, 0, 1, 0],
        playNumber: 1,
        playCount: 1,
        recordedAt: '2022-12-31T23:59:59.999Z',
        player: {
          name: 'rival',
        },
      },
    },
  ]
  const signedUpUsernames = new Set<string>(['taken'])

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
      if (!options.md5s.every((x) => typeof x === 'string')) {
        console.error('Invalid md5s...', options.md5s)
        throw new Error('Invalid md5s (this is a programmer error)')
      }
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
  count: ScoreCount
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
