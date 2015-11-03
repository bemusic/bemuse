
import React    from 'react'
import MAIN     from 'bemuse/utils/main-element'
import Ranking  from 'bemuse/app/ui/Ranking'
import './ranking-table-playground.scss'

const RankingTablePlayground = React.createClass({
  render() {
    return <div className="ranking-table-playground">
      <Ranking
        state={{
          data: [
            { playerName: 'One', score: '543210', count: [5, 4, 3, 2, 1], total: 15, rank: 1 },
            { playerName: 'Two', score: '123456', count: [1, 2, 3, 4, 5], total: 15, rank: 2 },
          ],
          meta: {
            scoreboard: {
              status: 'completed',
            },
            submission: {
              status: 'completed',
              record: { playerName: 'One', score: '543210', count: [5, 4, 3, 2, 1], total: 15, rank: 1 },
            }
          }
        }}
      />
      <Ranking
        state={{
          data: [
            { playerName: 'One', score: '543210', count: [5, 4, 3, 2, 1], total: 15, rank: 1 },
            { playerName: 'Two', score: '123456', count: [1, 2, 3, 4, 5], total: 15, rank: 2 },
          ],
          meta: {
            scoreboard: {
              status: 'completed',
            },
            submission: {
              status: 'completed',
              record: null,
            }
          }
        }}
      />
      <Ranking
        state={{
          data: null,
          meta: {
            scoreboard: {
              status: 'completed',
            },
            submission: {
              status: 'unauthenticated',
            }
          }
        }}
      />
      <Ranking
        state={{
          data: null,
          meta: {
            scoreboard: {
              status: 'loading',
            },
            submission: {
              status: 'loading',
            }
          }
        }}
      />
      <Ranking
        state={{
          data: null,
          meta: {
            scoreboard: {
              status: 'error',
            },
            submission: {
              status: 'error',
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
