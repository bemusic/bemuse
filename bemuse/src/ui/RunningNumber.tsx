import './RunningNumber.scss'

import React, { useEffect, useRef } from 'react'

import now from 'bemuse/utils/now'

export interface RunningNumberProps {
  formatter?: (value: number) => string
  value: number
}

const RunningNumber = ({ formatter, value }: RunningNumberProps) => {
  const nodeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const getText = (value: number) => {
      if (formatter) return formatter(value)
      return value.toFixed(0)
    }

    const node = nodeRef.current
    const text = document.createTextNode('')
    node!.appendChild(text)
    text.nodeValue = getText(0)
    const started = now()
    const interval = setInterval(() => {
      let progress = Math.min(1, Math.max(0, (now() - started) / 2000))
      progress = 1 - Math.pow(1 - progress, 4)
      text.nodeValue = getText(value * progress)
      if (progress === 1) {
        clearInterval(interval)
      }
    }, 16)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <span ref={nodeRef} className='RunningNumber' />
}

export default RunningNumber
