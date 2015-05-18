
import React from 'react'
import MAIN  from 'bemuse/utils/main-element'
import CustomBMS from 'bemuse/app/ui/custom-bms'

const DropBMSScene = React.createClass({
  render() {
    return <div>
      <CustomBMS />
    </div>
  }
})

export function main() {
  React.render(<DropBMSScene />, MAIN)
}
