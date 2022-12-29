import React, { MouseEvent, useMemo } from 'react'

import Markdown from 'markdown-it'

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
  function onClick(e: MouseEvent) {
    e.preventDefault()
    if (e.target instanceof HTMLAnchorElement) {
      window.open(e.target.href, '_blank')
    }
  }

  const html = useMemo(
    () => (safe ? safeMarkdown : markdown).render(source ?? ''),
    [safe, source]
  )

  return (
    <article
      onClick={onClick}
      className='Markdown'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default MarkdownContent
