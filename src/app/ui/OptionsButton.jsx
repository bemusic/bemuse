
import './OptionsButton.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <button className="OptionsButton" onClick={this.props.onClick}>
      {this.props.children}
    </button>
  }
})
