import CustomBMS from 'bemuse/app/ui/CustomBMS'
import React from 'react'
import { sceneRoot } from 'bemuse/utils/main-element'

const DropBMSScene = () => (
  <div>
    <CustomBMS />
  </div>
)

export function main() {
  sceneRoot.render(<DropBMSScene />)
}
