
import './running-number.scss'
import React from 'react'
import now   from 'bemuse/utils/now'

export default React.createClass({
  render() {
    return <span className="running-number"></span>
  },
  componentDidMount() {
    let node = this.getDOMNode()
    let text = document.createTextNode('')
    node.appendChild(text)
    text.nodeValue = this._getText(0)
    let started = now()
    let interval = setInterval(() => {
      let progress = Math.min(1, Math.max(0, (now() - started) / 2000))
      progress = 1 - Math.pow(1 - progress, 4)
      text.nodeValue = this._getText(this.props.value * progress)
      if (progress === 1) {
        clearInterval(interval)
      }
    }, 16)
  },
  _getText(value) {
    if (this.props.formatter) return this.props.formatter(value)
    return value.toFixed(0)
  },
})
