
import './ranking.scss'
import React from 'react'
import c     from 'classnames'
import RankingTable from './ranking-table'

export default React.createClass({
  render() {
    return <div className="ranking">
      {this.renderYours()}
      {this.renderLeaderboard()}
    </div>
  },
  renderYours() {
    const state = this.props.state
    const submission = state.meta.submission
    return <div className="ranking--yours">
      <div className="ranking--title">
        Your ranking
      </div>
      <RankingTable>
        {
          submission.record
          ? <RankingTable.Row
                record={submission.record}
                rank={submission.rank}
            />
          : (
            submission.status === 'unauthenticated'
            ? <RankingTable.Message>
                Please log in
              </RankingTable.Message>
            : (
              submission.status === 'error'
              ? <RankingTable.Message>
                  Failed to submit (retry)
                </RankingTable.Message>
              : <RankingTable.Message>
                  Submitting score...
                </RankingTable.Message>
            )
          )
        }
      </RankingTable>
    </div>
  },
  renderLeaderboard() {
    const state = this.props.state
    return <div className="ranking--leaderboard">
      <div className="ranking--title">
        Leaderboard
      </div>
      <RankingTable>
        {
          state.data && state.data.length
          ? state.data.map((record, index) =>
              <RankingTable.Row
                  key={index}
                  record={record}
                  rank={index + 1}
              />
            )
          : (
            state.meta.scoreboard.status === 'loading'
            ? <RankingTable.Message>Loading...</RankingTable.Message>
            : (
              state.meta.scoreboard.status === 'error'
              ? <RankingTable.Message>Error...</RankingTable.Message>
              : <RankingTable.Message>No Data</RankingTable.Message>
            )
          )
        }
      </RankingTable>
    </div>
  }
})
