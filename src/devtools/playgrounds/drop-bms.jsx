import React from 'react'
import MAIN from 'bemuse/utils/main-element'
import CustomBMS from 'bemuse/app/ui/CustomBMS'
import ReactDOM from 'react-dom'

const DropBMSScene = () => (
  <div>
    <CustomBMS />
  </div>
)

export function main () {
  ReactDOM.render(<DropBMSScene />, MAIN)
}
