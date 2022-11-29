import './ranking-table-playground.scss'

import MAIN from 'bemuse/utils/main-element'
import Ranking from 'bemuse/app/ui/Ranking'
import React from 'react'
import ReactDOM from 'react-dom'

const RankingTablePlayground = () => (
  <div className='ranking-table-playground'>
    <Ranking
      state={{
        data: [
          {
            playerName: 'One',
            score: 543210,
            count: [5, 4, 3, 2, 1],
            total: 15,
            rank: 1,
          },
          {
            playerName: 'Two',
            score: 123456,
            count: [1, 2, 3, 4, 5],
            total: 15,
            rank: 2,
          },
        ],
        meta: {
          scoreboard: {
            status: 'completed',
            value: null,
          },
          submission: {
            status: 'completed',
            value: {
              playerName: 'One',
              score: 543210,
              count: [5, 4, 3, 2, 1],
              total: 15,
              rank: 1,
            },
          },
        },
      }}
    />
    <Ranking
      state={{
        data: [
          {
            playerName: 'One',
            score: 543210,
            count: [5, 4, 3, 2, 1],
            total: 15,
            rank: 1,
          },
          {
            playerName: 'Two',
            score: 123456,
            count: [1, 2, 3, 4, 5],
            total: 15,
            rank: 2,
          },
        ],
        meta: {
          scoreboard: {
            status: 'completed',
            value: null,
          },
          submission: {
            status: 'completed',
            value: null,
          },
        },
      }}
    />
    <Ranking
      state={{
        data: null,
        meta: {
          scoreboard: {
            status: 'completed',
            value: null,
          },
          submission: {
            status: 'unauthenticated',
          },
        },
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
          },
        },
      }}
    />
    <Ranking
      state={{
        data: null,
        meta: {
          scoreboard: {
            status: 'error',
            error: new Error(),
          },
          submission: {
            status: 'error',
            error: new Error(),
          },
        },
      }}
    />
  </div>
)

export function main() {
  ReactDOM.render(<RankingTablePlayground />, MAIN)
}
