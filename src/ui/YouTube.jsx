import './YouTube.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class YouTube extends React.Component {
  static propTypes = {
    url: PropTypes.string
  }

  render () {
    return (
      <iframe
        width='100%'
        className='YouTube'
        src={this.getUrl()}
        frameBorder='0'
        allowFullScreen
      />
    )
  }

  getUrl = () => {
    return (
      'https://www.youtube.com/embed/' + this.props.url.match(/v=([^&]+)/)[1]
    )
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    let el = ReactDOM.findDOMNode(this)
    el.style.height = el.offsetWidth * 9 / 16 + 'px'
  }
}
