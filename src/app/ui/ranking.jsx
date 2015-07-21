
import './ranking.scss'
import React from 'react'
import c     from 'classnames'
import RankingTable from './ranking-table'

export default React.createClass({
  render() {
    return <div className="ranking">
      <div className="ranking--title">
        Your ranking
      </div>
      <RankingTable>
        <RankingTable.Row
            record={this.props.state.meta.submission.record}
            rank={this.props.state.meta.submission.rank} />
      </RankingTable>
      <div className="ranking--title">
        Leaderboard
      </div>
      <RankingTable>
        {this.props.state.data.map((record, index) =>
          <RankingTable.Row
              key={index}
              record={record}
              rank={index + 1} />
        )}
      </RankingTable>
    </div>
  }
})
