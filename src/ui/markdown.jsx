
import Remarkable from 'remarkable'
import React      from 'react'

const markdown = new Remarkable({ linkify: true })

export default React.createClass({
  render() {
    return <article className="markdown"></article>
  },
  componentDidMount() {
    this.update()
    this.getDOMNode().addEventListener('click', e => {
      e.preventDefault()
      if (e.target.href) {
        window.open(e.target.href, '_blank')
      }
    })
  },
  componentDidUpdate() {
    this.update()
  },
  update() {
    let html = markdown.render(this.props.source)
    this.getDOMNode().innerHTML = html
  },
})
