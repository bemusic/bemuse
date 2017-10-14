
import React from 'react'

export default class Flex extends React.Component {
  render() {
    let style = { }
    if (this.props.grow !== undefined) style.flex = this.props.grow
    return <div style={style}></div>
  }
}
