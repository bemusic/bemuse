
import React from 'react'

export default React.createClass({
  render () {
    let style = { }
    if (this.props.grow !== undefined) style.flex = this.props.grow
    return <div style={style}></div>
  }
})
