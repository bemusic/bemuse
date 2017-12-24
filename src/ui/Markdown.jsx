import Markdown from 'markdown-it'
import React from 'react'
import ReactDOM from 'react-dom'

const markdown = new Markdown({
  linkify: true,
  breaks: true,
  typographer: true
})

const safeMarkdown = new Markdown({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true
})

export default class MarkdownContent extends React.Component {
  render () {
    return (
      <article
        className='Markdown'
        dangerouslySetInnerHTML={this.renderHTML()}
      />
    )
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this).addEventListener('click', e => {
      e.preventDefault()
      if (e.target.href) {
        window.open(e.target.href, '_blank')
      }
    })
  }

  renderHTML = () => {
    const html = (this.props.safe ? safeMarkdown : markdown).render(
      this.props.source
    )
    return { __html: html }
  }
}
