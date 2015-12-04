
import Markdown   from 'markdown-it'
import React      from 'react'

const markdown = new Markdown({
  linkify: true,
  breaks: true,
  typographer: true,
})

const safeMarkdown = new Markdown({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
})

export default React.createClass({
  render () {
    return <article className="Markdown"></article>
  },
  componentDidMount () {
    this.update()
    this.getDOMNode().addEventListener('click', e => {
      e.preventDefault()
      if (e.target.href) {
        window.open(e.target.href, '_blank')
      }
    })
  },
  componentDidUpdate () {
    this.update()
  },
  update () {
    let html = (this.props.safe ? safeMarkdown : markdown).render(this.props.source)
    this.getDOMNode().innerHTML = html
  },
})
