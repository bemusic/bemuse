import './RunningNumber.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import now from 'bemuse/utils/now'

export default class RunningNumber extends React.Component {
  static propTypes = {
    formatter: PropTypes.func,
    value: PropTypes.number.isRequired,
  }

  render() {
    return <span className='RunningNumber' />
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this)
    const text = document.createTextNode('')
    node.appendChild(text)
    text.nodeValue = this._getText(0)
    const started = now()
    const interval = setInterval(() => {
      let progress = Math.min(1, Math.max(0, (now() - started) / 2000))
      progress = 1 - Math.pow(1 - progress, 4)
      text.nodeValue = this._getText(this.props.value * progress)
      if (progress === 1) {
        clearInterval(interval)
      }
    }, 16)
  }

  _getText = (value) => {
    if (this.props.formatter) return this.props.formatter(value)
    return value.toFixed(0)
  }
}
