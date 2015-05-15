
import React from 'react'
import MAIN  from 'bemuse/utils/main-element'

const DropBMSScene = React.createClass({
  render() {
    return <div>meow</div>
  }
})

export function main() {
  React.render(<DropBMSScene />, MAIN)
}
