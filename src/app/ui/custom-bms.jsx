
import './custom-bms.scss'
import React from 'react'
import Panel from 'bemuse/ui/panel'

export default React.createClass({
  render() {
    return <Panel className="custom-bms" title="Load Custom BMS">
      <div className="custom-bms--wrapper">
        <div className="custom-bms--instruction">
          Please drag and drop a BMS folder into the drop zone below.
        </div>
        <div className="custom-bms--remark">
          This feature only works in Google Chrome.
        </div>
        <div className="custom-bms--remark">
          Please don’t play unauthorized / illegally obtained BMS files.
        </div>
        <div className="custom-bms--dropzone">
          <div className="custom-bms--dropzone-hint">Drop BMS folder here.</div>
        </div>
      </div>
    </Panel>
  }
})
