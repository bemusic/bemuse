
import './title-scene.scss'

import React            from 'react'
import c                from 'classnames'
import { Binding }      from 'bemuse/flux'
import Scene            from 'bemuse/ui/scene'

React.initializeTouchEvents(true)

export default React.createClass({

  render() {
    return <Scene className="title-scene">
      <div className="title-scene--logo" >
        <div className="title-scene--absmessage" >
          ...Click to start...
        </div>
      </div>
    </Scene>
  }

})
