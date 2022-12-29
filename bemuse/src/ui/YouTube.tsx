import './YouTube.scss'

import React, { useEffect, useRef } from 'react'

const getUrl = (url: string) =>
  'https://www.youtube.com/embed/' + url.match(/v=([^&]+)/)![1]

export interface YouTubeProps {
  url: string
}

const YouTube = ({ url }: YouTubeProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const el = frameRef.current
      if (el) {
        el.style.height = (el.offsetWidth * 9) / 16 + 'px'
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <iframe
      ref={frameRef}
      width='100%'
      className='YouTube'
      src={getUrl(url)}
      frameBorder='0'
      allowFullScreen
    />
  )
}

export default YouTube
