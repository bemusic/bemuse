
import './youtube.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <iframe width='100%' className='youtube'
        src={this.getUrl()} frameBorder='0' allowfullscreen></iframe>
  },
  getUrl() {
    return 'https://www.youtube.com/embed/' +
        this.props.url.match(/v=([^&]+)/)[1]
  },
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  componentWillUnmount() {
    window.addEventListener('resize', this.handleResize)
  },
  handleResize() {
    let el = this.getDOMNode()
    el.style.height = el.offsetWidth * 9 / 16 + 'px'
  },
})
