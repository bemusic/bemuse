
import './options-button.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <button className="options-button" onClick={this.props.onClick}>
      {this.props.children}
    </button>
  }
})
