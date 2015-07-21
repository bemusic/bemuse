
import React    from 'react'
import MAIN     from 'bemuse/utils/main-element'
import Ranking  from 'bemuse/app/ui/ranking'
import './ranking-table-playground.scss'

const RankingTablePlayground = React.createClass({
  render() {
    return <div className="ranking-table-playground">
      <Ranking
        state={{
          data: [
            { playerName: 'One', score: '543210', count: [5, 4, 3, 2, 1], total: 15 },
            { playerName: 'Two', score: '123456', count: [1, 2, 3, 4, 5], total: 15 },
          ],
          meta: {
            scoreboard: {
              status: 'completed',
            },
            submission: {
              status: 'completed',
              rank:   1,
              record: { playerName: 'One', score: '543210', count: [5, 4, 3, 2, 1], total: 15 },
            }
          }
        }}
      />
    </div>
  }
})

export function main() {
  React.render(<RankingTablePlayground />, MAIN)
}
