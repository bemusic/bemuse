import './YouTube.scss'

import React, { useEffect, useRef } from 'react'

export const getYouTubeVideoId = (url: string): string | undefined => {
  try {
    const { hostname, pathname, searchParams } = new URL(url)
    if (hostname === 'youtu.be') return pathname.split('/')[1] || undefined
    return (
      searchParams.get('v') ||
      pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
      undefined
    )
  } catch {
    return undefined
  }
}

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

  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  return (
    <iframe
      ref={frameRef}
      width='100%'
      className='YouTube'
      src={'https://www.youtube.com/embed/' + videoId}
      frameBorder='0'
      allowFullScreen
    />
  )
}

export default YouTube
