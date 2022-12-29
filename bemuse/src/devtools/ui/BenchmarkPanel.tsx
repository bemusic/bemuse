import './BenchmarkPanel.scss'

import React, { MouseEvent, TouchEvent, useEffect, useState } from 'react'

const Table = ({ stats }: { stats: Record<string, unknown> }) => (
  <table>
    <tbody>
      {Object.keys(stats).map((key) => {
        const stat = stats[key]
        return (
          <tr key={key}>
            <td>
              <strong>{key}</strong>
            </td>
            <td align='right'>{'' + stat}</td>
          </tr>
        )
      })}
    </tbody>
  </table>
)

export interface BenchmarkPanelProps {
  bench: {
    stats: Record<string, unknown>
  }
}

const BenchmarkPanel = ({ bench }: BenchmarkPanelProps) => {
  const [show, setShow] = useState(false)
  const [, updater] = useState(false)

  useEffect(() => {
    const id = setInterval(() => updater((flag) => !flag), 1000)
    return () => {
      clearInterval(id)
    }
  }, [])

  const handleInteraction = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShow((flag) => !flag)
  }

  return (
    <div
      className='BenchmarkPanel'
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {show ? (
        <article>
          <b>Benchmark Stats</b>
          <br />
          <Table stats={bench.stats} />
        </article>
      ) : (
        'Show Benchmark Stats'
      )}
    </div>
  )
}

export default BenchmarkPanel
