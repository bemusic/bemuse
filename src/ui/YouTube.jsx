
import './YouTube.scss'
import React from 'react'
import ReactDOM from 'react-dom'

export default React.createClass({
  render () {
    return <iframe width='100%' className='YouTube'
        src={this.getUrl()} frameBorder='0' allowFullScreen></iframe>
  },
  getUrl () {
    return 'https://www.youtube.com/embed/' +
        this.props.url.match(/v=([^&]+)/)[1]
  },
  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  },
  handleResize () {
    let el = ReactDOM.findDOMNode(this)
    el.style.height = el.offsetWidth * 9 / 16 + 'px'
  },
})
