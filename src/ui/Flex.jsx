import React from 'react'
import PropTypes from 'prop-types'

export default class Flex extends React.Component {
  static propTypes = {
    grow: PropTypes.oneOf([PropTypes.number, PropTypes.string])
  }

  render () {
    let style = {}
    if (this.props.grow !== undefined) style.flex = this.props.grow
    return <div style={style} />
  }
}
