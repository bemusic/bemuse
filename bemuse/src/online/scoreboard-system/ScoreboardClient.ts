import { MappingMode } from 'bemuse/app/entities/Options'
import type { ScoreCount } from 'bemuse/rules/accuracy'

export interface ScoreboardClient {
  signUp(options: {
    username: string
    password: string
    email: string
  }): Promise<{
    playerToken: string
  }>

  loginByUsernamePassword(options: {
    username: string
    password: string
  }): Promise<{
    playerToken: string
  }>

  changePassword(options: { email: string }): Promise<{}>

  submitScore(options: {
    playerToken: string
    md5: string
    playMode: MappingMode
    input: SubmitScoreInput
  }): Promise<{
    data: {
      registerScore: {
        resultingRow: ScoreboardRow
      }
    }
  }>

  retrieveScoreboard(options: { md5: string; playMode: string }): Promise<{
    data: {
      chart: {
        level: {
          leaderboard: ScoreboardRow[]
        }
      }
    }
  }>

  retrieveRecord(options: {
    playerToken: string
    md5: string
    playMode: string
  }): Promise<{
    data: {
      chart: {
        level: {
          myRecord: ScoreboardRow | null
        }
      }
    }
  }>

  retrieveRankingEntries(options: {
    playerToken: string
    md5s: string[]
  }): Promise<{
    data: {
      me: {
        records: {
          md5: string
          playMode: MappingMode
          entry: ScoreboardEntry
        }[]
      }
    }
  }>

  renewPlayerToken(options: { playerToken: string }): Promise<string>
}

export interface SubmitScoreInput {
  score: number
  combo: number
  count: ScoreCount
  log: string
  total: number
}

export interface ScoreboardRow {
  rank?: number
  entry: ScoreboardEntry
}

export interface ScoreboardEntry {
  id: string
  score: number
  total: number
  combo: number
  count: ScoreCount
  playNumber: number
  playCount: number
  recordedAt: string
  player: {
    name: string
  }
}
