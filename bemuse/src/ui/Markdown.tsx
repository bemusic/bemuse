import Markdown from 'markdown-it'
import React, { useEffect, useRef } from 'react'

const markdown = new Markdown({
  linkify: true,
  breaks: true,
  typographer: true,
})

const safeMarkdown = new Markdown({
  html: true,
  linkify: true,
  typographer: true,
})

export interface MarkdownContentProps {
  safe?: boolean
  source: string | null
}

const MarkdownContent = ({ source, safe }: MarkdownContentProps) => {
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    articleRef.current?.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault()
      if (e.target instanceof HTMLAnchorElement) {
        window.open(e.target.href, '_blank')
      }
    })
  }, [])

  const html = (safe ? safeMarkdown : markdown).render(source ?? '')

  return (
    <article
      ref={articleRef}
      className='Markdown'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default MarkdownContent
