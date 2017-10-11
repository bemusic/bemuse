
import React, { Component } from 'react'

export default class extends Component {
  render ({ grow }) {
    let style = { }
    if (grow !== undefined) style.flex = grow
    return <div style={style}></div>
  }
}
